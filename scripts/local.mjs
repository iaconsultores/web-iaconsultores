process.env.HOST ??= "127.0.0.1";
process.env.PORT ??= "4329";
process.env.CLAUDE_SIMULADO ??= "1";
process.env.RESEND_SIMULADO ??= "1";
await import("../servidor.mjs");
