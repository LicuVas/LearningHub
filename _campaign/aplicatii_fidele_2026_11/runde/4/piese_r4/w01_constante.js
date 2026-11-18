  /* Ctrl+S pe un document nou (Word M365) = fereastra Office „Save this file”, desenată din referință (uia_word.json ›
     dialog.save_this_file: File name, Save as type, Choose a Location, More options…, Save, Cancel; runda `acoperire`
     18.11.2026 — închide abaterea A2-1). Ctrl+W / ✕ pe un document modificat = „Save your changes to this file?”
     (dialog.save_your_changes_to_this_file: More options…, Save, Don't Save, Cancel; scenarii_real/word-ctrl-w-*.json).
     Amândouă sunt NUIDialog: bara de titlu are doar ✕, textul mare e numele ferestrei interioare. */
  const SALVARE_NOUA = 'dialog.save_this_file';
  const INTREBARE_INCHIDERE = 'dialog.save_your_changes_to_this_file';
  const OFFICE_NUI = [SALVARE_NOUA, INTREBARE_INCHIDERE];

