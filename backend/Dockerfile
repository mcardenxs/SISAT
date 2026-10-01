# Usar la imagen oficial de Bun
FROM oven/bun:1.1 AS base
WORKDIR /app

# Instalar dependencias (el lockfile vive en la raíz del monorepo)
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json /temp/dev/
RUN cd /temp/dev && bun install

# Instalar dependencias de producción
RUN mkdir -p /temp/prod
COPY package.json /temp/prod/
RUN cd /temp/prod && bun install --production

# Crear imagen final
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Generar cliente de Prisma
RUN bunx prisma generate

# Exponer el puerto
EXPOSE 3000

# Comando para arrancar la aplicación
CMD [ "bun", "run", "dev" ]
