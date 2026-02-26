import {
  AutoTokenizer,
  AutoModelForCausalLM,
  TextStreamer,
  type PreTrainedTokenizer,
  type PreTrainedModel,
} from "@huggingface/transformers";

let tokenizer: PreTrainedTokenizer | null = null;
let model: PreTrainedModel | null = null;

const MODEL_ID = "onnx-community/Qwen3-0.6B-ONNX";

type Message = {
  role: "user" | "assistant";
  content: string;
};

async function checkWebGPUSupport(): Promise<boolean> {
  const nav = navigator as Navigator & { gpu?: { requestAdapter: () => Promise<unknown | null> } };
  if (!nav.gpu) return false;
  try {
    const adapter = await nav.gpu.requestAdapter();
    return adapter !== null;
  } catch {
    return false;
  }
}

async function loadModel() {
  const hasWebGPU = await checkWebGPUSupport();

  try {
    self.postMessage({ type: "status", status: "Loading tokenizer..." });
    tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID);

    if (hasWebGPU) {
      self.postMessage({ type: "status", status: "Loading model with WebGPU..." });
      model = await AutoModelForCausalLM.from_pretrained(MODEL_ID, {
        dtype: "q4f16",
        device: "webgpu",
      });
    } else {
      self.postMessage({ type: "status", status: "Loading model with CPU (WASM)..." });
      // CPU/WASMの場合はdeviceを省略、dtypeはq8かfp32を使う
      model = await AutoModelForCausalLM.from_pretrained(MODEL_ID, {
        dtype: "q8",
      });
    }

    self.postMessage({ type: "status", status: "Model loaded successfully!" });
  } catch (error) {
    console.error("Failed to load model:", error);
    self.postMessage({
      type: "error",
      error: `Failed to load model: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
}

async function generate(messages: Message[]) {
  if (!tokenizer || !model) {
    self.postMessage({ type: "error", error: "Model not loaded" });
    return;
  }

  try {
    const chatMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const text = tokenizer.apply_chat_template(chatMessages, {
      tokenize: false,
      add_generation_prompt: true,
    }) as string;

    const inputs = tokenizer(text, {
      return_tensors: "pt",
    });

    const streamer = new TextStreamer(tokenizer, {
      skip_prompt: true,
      skip_special_tokens: true,
      callback_function: (token: string) => {
        self.postMessage({ type: "stream", text: token });
      },
    });

    await model.generate({
      ...inputs,
      max_new_tokens: 512,
      do_sample: true,
      temperature: 0.7,
      top_p: 0.9,
      streamer,
    });

    self.postMessage({ type: "done" });
  } catch (error) {
    console.error("Generation error:", error);
    self.postMessage({
      type: "error",
      error: "Generation failed. Please try again.",
    });
  }
}

self.onmessage = async (e) => {
  const { type, messages } = e.data;

  if (type === "load") {
    await loadModel();
  } else if (type === "generate") {
    await generate(messages);
  }
};
