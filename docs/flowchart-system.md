# Flowchart - Keseluruhan Sistem

File: docs/flowchart-system.puml

Cara merender:
- Online: https://www.plantuml.com/plantuml/ -> paste isi `.puml`.
- Lokal: instal PlantUML + Graphviz, lalu:
  java -jar plantuml.jar docs/flowchart-system.puml
  -> menghasilkan PNG/SVG di folder yang sama.

Ringkasan alur:
1. **Authentication**: Cek token; jika tidak ada/invalid, redirect ke login.
2. **Dashboard**: Setelah login, tampil menu utama (Members, Transactions, Loans, Reports, Settings).
3. **Manage Members**: CRUD operasi (View, Create, Edit, Delete) dengan POST/PUT/DELETE API.
4. **Create Transaction**: Form transaksi -> POST /transactions -> update balance -> notifikasi member.
5. **Apply Loan**: Form pinjaman -> POST /loans -> auto-approve atau notifikasi officer.
6. **View Reports**: Filter & aggregate data -> generate/download report.
7. **Logout**: Clear token & redirect ke login.

Gunakan file `.puml` sebagai referensi untuk meng-update alur jika ada perubahan fitur atau proses.
