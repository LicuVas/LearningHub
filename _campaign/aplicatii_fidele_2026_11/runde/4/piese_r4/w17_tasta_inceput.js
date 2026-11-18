      /* Enter într-o fereastră apasă butonul ei implicit: Save (Save As, „Save this file”, „Save your changes…”) */
      const activatEnter = () => !dialog ? null : (dialog.baza === 'dialog.FileSaveAs' || dialog.baza === SALVARE_NOUA) ? 'dialog_salvare:Save' :
        dialog.baza === INTREBARE_INCHIDERE ? 'fereastra:Save' : null;
      /* o listă deschisă (Font Size, Save as type) ia săgețile, Enter și Esc înaintea casetei și a ferestrei */
      const rl = tastaLista(e);
      if (rl) return rl;
