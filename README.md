# Programmkompass

TV-Programmführer für deutschsprachige Free- und Pay-TV-Sender aus Deutschland, Österreich und der Schweiz.

## So funktioniert es

- `index.html` ist die komplette App (eine Datei, kein Build nötig).
- `channels.xml` ordnet jedem Sender der App eine Datenquelle zu
  (web.magentatv.de, tv.blue.ch, teleboy.ch, tvheute.at). `xmltv_id` ist die Sender-ID in der App.
- `.github/workflows/epg.yml` holt jede Nacht mit [iptv-org/epg](https://github.com/iptv-org/epg)
  das Programm für 7 Tage, legt es als `guide.xml` neben die App und veröffentlicht beides auf GitHub Pages.
- Die App lädt `guide.xml` beim Start automatisch. Sender ohne Datenquelle zeigen ein Beispielprogramm
  und sind mit „Beispiel“ markiert.

## Manuell aktualisieren

GitHub → Reiter **Actions** → „Programmdaten aktualisieren“ → **Run workflow**.

## Sender ergänzen oder korrigieren

1. Den Sender in den Listen unter `sites/<quelle>/<quelle>.channels.xml` im iptv-org/epg-Repository suchen.
2. Die Zeile in `channels.xml` übernehmen und `xmltv_id` auf die Sender-ID aus der App setzen
   (siehe `RAW`-Liste in `index.html`).

## Hinweis

Die Programmdaten stammen von den Webseiten der jeweiligen Anbieter und sind nur für den privaten Gebrauch gedacht.
