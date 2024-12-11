# Menggunakan image Node.js resmi
FROM node:18

# Menetapkan direktori kerja di dalam kontainer
WORKDIR /usr/src/app

# Menyalin package.json dan menginstall dependencies
COPY package*.json ./
RUN npm install

# Menyalin seluruh file aplikasi
COPY . .

# Mengekspos port yang akan digunakan oleh aplikasi
EXPOSE 8080

# Menetapkan variabel lingkungan
ENV NODE_ENV=production
ENV PORT=8080

# Perintah untuk menjalankan aplikasi
CMD ["node", "src/index.js"]
