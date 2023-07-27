FROM node:20-slim AS BASEIMAGE

WORKDIR /src
RUN apt-get update || : && apt-get install make gcc g++ python3 -y
RUN mkdir -p /opt/share/pnpm && chown -R node /opt/share && npm i -g pnpm

ENV PNPM_HOME="/opt/share/pnpm"
ENV NODE_PATH="/opt/node_modules"
ENV PATH="$PNPM_HOME:$NODE_PATH:$PATH"

COPY package*.json ./
COPY . .
RUN pnpm run build && pnpm prune --production

FROM node:20-slim

WORKDIR /src
ENV TZ=Europe/Istanbul
COPY --from=BASEIMAGE /src/dist /src/dist
COPY --from=BASEIMAGE /src/node_modules /src/node_modules
COPY --from=BASEIMAGE /src/.env /src/.env
EXPOSE 3000

CMD ["node", "dist/main.js"]
