# Multi-stage build para Distribuidora San Martín
FROM node:18-bullseye AS builder

# Instalar Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Instalar dependencias de Tauri en Linux
RUN apt-get update && apt-get install -y \
    libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Instalar Tauri CLI
RUN npm install -g @tauri-apps/cli@latest

# Copiar proyecto
WORKDIR /app
COPY . .

# Instalar dependencias npm
RUN npm install

# Compilar backend Rust
WORKDIR /app/src-tauri
RUN cargo build --release

# Compilar frontend
WORKDIR /app
RUN npm run build

# Stage final: distribución
FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y \
    libwebkit2gtk-4.0-37 \
    libgtk-3-0 \
    libayatana-appindicator3-1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /app/src-tauri/target/release/distribuidora_san_martin* /app/
COPY --from=builder /app/dist /app/dist

EXPOSE 3000

CMD ["/app/distribuidora_san_martin"]
