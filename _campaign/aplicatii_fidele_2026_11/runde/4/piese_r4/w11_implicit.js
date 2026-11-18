      /* Enter în „Save your changes…” = Save, ca în „Save this file” (butonul apăsat de Enter: NEVERIFICAT, AC-3) */
      if (dialog.baza === INTREBARE_INCHIDERE) {
        if (M.intrebare) M.intrebare.apasat = 'Save';
        const cum = M.dupaInchidere, r = salveaza();
        return r === 'salvare' ? inchideDocument(cum, 'salvare_si_inchidere') : r;
      }
