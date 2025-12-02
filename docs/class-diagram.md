# Class Diagram (PlantUML)

File PlantUML: `docs/class-diagram.puml`

Cara merender:
- Online: salin konten `.puml` ke https://www.plantuml.com/plantuml/ atau gunakan PlantUML online editor.
- Lokal: instal PlantUML dan Graphviz lalu jalankan:
  java -jar plantuml.jar docs/class-diagram.puml
  -> akan menghasilkan PNG/SVG di folder yang sama.

Ringkasan:
- Domain: User, Member, Account, Saving, Loan, Transaction.
- Services: ApiService, AuthService, NotificationService.
- Frontend: App, Router, Dashboard, MemberList, MemberDetail, TransactionForm.
- Store: representasi state global (Context/Redux).
- Relasi menunjukkan kepemilikan (composition), asosiasi dan dependensi service.

Gunakan file `.puml` sebagai dasar untuk menyesuaikan diagram jika ada model/komponen tambahan.
