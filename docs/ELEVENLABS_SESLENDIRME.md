# ElevenLabs seslendirme kurulumu

## İlk kurulum

Repo kökünde:

```bash
cp .env.local.example .env.local
```

`.env.local` dosyasındaki `ELEVENLABS_API_KEY` değerine ElevenLabs panelinden oluşturduğunuz anahtarı yazın. Anahtarı mobil uygulama koduna, prompta veya Git'e koymayın.

Varsayılan model `eleven_multilingual_v2`'dir. `ELEVENLABS_VOICE_ID` boş bırakılırsa ses, hikâyenin kitap kategorisine göre `.agents/skills/create-video/voice-library.json` dosyasından seçilir.

## Yapılandırmayı kontrol etme

Onaylanmış bir video projesi için ücretli üretim yapmadan:

```bash
node --env-file=.env.local .agents/skills/create-video/scripts/create-voiceover.mjs \
  --project artifacts/story-videos/PROJE_KLASORU \
  --provider elevenlabs --dry-run
```

Çıktıda `apiKeyConfigured: true`, seçilen `voiceId` ve `modelId` görülmelidir. Anahtarın kendisi hiçbir zaman yazdırılmaz.

## Ses dosyası üretme

Kullanıcı onayı kaydedilmiş proje için:

```bash
node --env-file=.env.local .agents/skills/create-video/scripts/create-voiceover.mjs \
  --project artifacts/story-videos/PROJE_KLASORU \
  --provider elevenlabs
```

Çıktı `audio/narration.mp3` olarak oluşturulur. Mevcut dosya korunur; yeniden üretmek için açıkça `--force` eklenmelidir.

## Model ve ses değiştirme

Tek üretimde model veya ses zorlanabilir:

```bash
node --env-file=.env.local .agents/skills/create-video/scripts/create-voiceover.mjs \
  --project artifacts/story-videos/PROJE_KLASORU \
  --provider elevenlabs \
  --model eleven_flash_v2_5 \
  --voice-id SES_KIMLIGI
```

ElevenLabs API anahtarı yoksa `auto` sağlayıcısı macOS yerel sesine düşer; ElevenLabs kullanımı zorunluysa `--provider elevenlabs` kullanın.
