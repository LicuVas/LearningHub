        /* nume_fisier: null cât documentul n-a fost salvat niciodată (scenarii_real/word-salvare-pdf.json) */
        nume_fisier: M.deschis && M.salvat ? M.nume : null,
        dialog_salvare: M.dialogSalvare ? Object.assign({}, M.dialogSalvare) : null,
        /* chei în plus (§5 le permite): folderul documentului salvat (lecția m1-l03) și TOATE fișierele din foldere, cu
           textul lor (cele din conținut + cele salvate), plus lista Recent */
        folder_fisier: M.deschis && M.salvat ? M.folder : null,
        fisiere: M.fs.map(f => ({ nume: f.nume, folder: f.folder, tip: f.tip, text: f.text.slice() })),
        recente: M.recente.map(r => ({ nume: r.nume, folder: r.folder })),
        /* cheile rundei `acoperire` (§5; sensul în descrierea scenariilor word-ctrl-*, word-salvare-pdf, word-x-*):
           fisiere_salvate = numele fișierelor scrise de Save, ordonate; dialog = ultima fereastră care a întrebat;
           documente_deschise; titlu_fereastra; pagina_backstage; tip_salvare_afisat = ce ARATĂ caseta Save as type */
        fisiere_salvate: M.salvari.slice().sort(),
        dialog: M.intrebare ? Object.assign({}, M.intrebare, { butoane: M.intrebare.butoane.slice() }) : null,
        documente_deschise: M.inchisApp ? 0 : (M.deschis ? 1 : 0) + M.altele.length,
        titlu_fereastra: titluFereastra(),
        pagina_backstage: backstage ? backstage.pagina : null,
        tip_salvare_afisat: tipAfisatAcum()
      };
    };
