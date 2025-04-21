FROM node:20-alpine AS build

WORKDIR /backend

RUN npm install -g pnpm

COPY package*.json ./

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:20-alpine AS production

WORKDIR /backend

RUN npm install -g pnpm

COPY --from=build /backend/package*.json ./
COPY --from=build /backend/node_modules ./node_modules
COPY --from=build /backend/dist ./dist

EXPOSE 5000

CMD ["node", "dist/main"]



