# Étape 1 : compilation Angular.
FROM node:22-alpine AS build

WORKDIR /app

# npm ci garantit une installation reproductible à partir de package-lock.json.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Étape 2 : publication des fichiers statiques avec Nginx.
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/sakai-ng/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=20s --timeout=5s --start-period=10s --retries=5 \
    CMD wget -qO- http://127.0.0.1/health >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
