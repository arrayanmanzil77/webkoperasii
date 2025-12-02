# Activity Diagram - Koperasi (frontend)

File: docs/activity-diagram.puml

Cara merender:
- Online: buka https://www.plantuml.com/plantuml/ dan paste isi `.puml`.
- Lokal: instal PlantUML + Graphviz, lalu jalankan:
  java -jar plantuml.jar docs/activity-diagram.puml
  -> menghasilkan PNG/SVG di folder yang sama.

Ringkasan alur:
- Autentikasi: Frontend -> API/Auth -> DB -> Frontend (token disimpan).
- Operasi utama: Manage Members, Transactions, Loan Application, Reports.
- Backend memvalidasi, menyimpan ke DB, dan memicu NotificationService.
- Proses approval pinjaman dapat auto-approve atau mengirim notifikasi ke officer.
