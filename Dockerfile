# Gunakan image Node.js yang sesuai sebagai base image
FROM node:18

# Tentukan direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Install dependensi yang diperlukan
RUN npm install

# Salin seluruh kode aplikasi ke dalam container
COPY . .

# Tentukan port yang akan digunakan oleh aplikasi
EXPOSE 3000
# Jalankan aplikasi saat container dijalankan
CMD ["npm", "start"]
