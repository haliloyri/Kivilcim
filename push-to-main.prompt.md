---
name: "Push To Main"
description: "Projeyi GitHub main dalina tasimak icin sadece 4 git komutunu sirayla calistir."
argument-hint: "Arguman gerekmez"
agent: "agent"
---

Asagidaki 4 komutu sadece bu sirayla calistir ve her komuttan sonra sonucu kontrol et. Bir komut hata verirse dur ve kullaniciya bildir.

```powershell
git add .
git commit -m "Proje güncellemeleri ve düzenlemeler"
git remote -v
git push origin main
```

Basarili olursa su bilgileri kisa olarak raporla:

- commit SHA (kisa)
- push hedefi (`origin/main`)
- remote URL (`git remote -v` icinden push satiri)
