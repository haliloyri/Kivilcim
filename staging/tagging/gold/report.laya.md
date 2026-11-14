# Etiket uyumu: laya vs el etiketi (gold)

80 ortak hikâye · 0 hikâyede tahmin yok · 0 hatalı tahmin satırı

## Karar
- Reels skoru: **NO-GO** — rubrik/prompt düzeltilmeli
- Tema etiketi: **NO-GO** — rubrik/prompt düzeltilmeli

## Reels skorları
| Skor | Birebir | ±1 | MAE | Sapma (tahmin−el) | QWK (≥0.6) |
|---|---:|---:|---:|---:|---:|
| fit_45s | 31% | 73% | 1.04 | +0.81 | -0.04 ❌ |
| hook | 35% | 89% | 0.79 | +0.31 | 0.12 ❌ |
| visual | 21% | 69% | 1.23 | -0.23 | 0.19 ❌ |

Birleşik Reels skoru (fit_45s 0.3, hook 0.4, visual 0.3):
- Sıralama uyumu, Spearman: 0.09 ❌ (≥0.6)
- İlk %20 örtüşmesi (16 hikâye): 25% ❌ (≥60%)

## Temalar
- Ana tema birebir: 36% ❌ (≥70%) · Cohen κ 0.3
- El ana teması tahmin setinde var: 41%
- Etiket seti Jaccard ortalaması: 0.29 ❌ (≥0.5)

| Tema | Destek | Kesinlik | Duyarlılık | F1 |
|---|---:|---:|---:|---:|
| leadership | 13 | 100% | 23% | 38% |
| communication | 6 | 100% | 17% | 29% |
| influence | 8 | 100% | 25% | 40% |
| relationships | 15 | 100% | 7% | 13% |
| decision_making | 7 | — | 0% | — |
| thinking | 13 | 21% | 69% | 33% |
| resilience | 8 | 33% | 13% | 18% |
| emotions | 24 | 57% | 54% | 55% |
| habits | 16 | 57% | 25% | 35% |
| focus | 10 | 33% | 10% | 15% |
| creativity | 9 | 25% | 67% | 36% |
| money_career | 14 | 86% | 43% | 57% |
| health | 8 | 75% | 38% | 50% |
| meaning | 8 | 33% | 13% | 18% |

En sık ana tema karışıklıkları (el → tahmin):
- focus → thinking: 4
- relationships → emotions: 3
- leadership → money_career: 3
- money_career → creativity: 3
- decision_making → thinking: 3
- thinking → creativity: 3
- habits → thinking: 2
- focus → emotions: 2

## En çok ayrışan 10 hikâye (skor farkı toplamı)
| id | fark | el (fit/hook/visual · tema) | tahmin |
|---|---:|---|---|
| 1498 | 7 | 3/3/1 · leadership | 5/5/4 · leadership |
| 1205 | 6 | 2/3/5 · meaning | 5/5/4 · emotions |
| 1782 | 6 | 1/4/2 · decision_making | 5/4/4 · thinking |
| 1252 | 6 | 3/3/5 · creativity | 5/4/2 · creativity |
| 1625 | 5 | 2/2/2 · relationships | 4/3/4 · emotions |
| 1661 | 5 | 4/2/1 · meaning | 5/5/2 · thinking |
| 1785 | 5 | 2/3/1 · communication | 5/4/2 · communication |
| 1697 | 5 | 5/5/5 · emotions | 4/4/2 · emotions |
| 1323 | 4 | 5/3/2 · thinking | 5/5/4 · thinking |
| 1115 | 4 | 4/5/4 · money_career | 5/4/2 · money_career |
