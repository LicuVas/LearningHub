# U4: cum citeste Windows valorile din blocul „Copiaza” (7.2 ...) pe ro-RO vs en-US. Datele regionale ale ACESTUI PC, nu ale laboratorului.
$ro = [Globalization.CultureInfo]::GetCultureInfo("ro-RO")
$en = [Globalization.CultureInfo]::GetCultureInfo("en-US")
"Sursa: .NET CultureInfo pe acest PC (Windows 11), $(Get-Date -Format dd.MM.yyyy) - datele regionale Windows, NU laboratorul"
"Cultura curenta a acestui PC: $((Get-Culture).Name)"
"ro-RO: separator zecimal=[$($ro.NumberFormat.NumberDecimalSeparator)] separator lista=[$($ro.TextInfo.ListSeparator)] data scurta=[$($ro.DateTimeFormat.ShortDatePattern)]"
"en-US: separator zecimal=[$($en.NumberFormat.NumberDecimalSeparator)] separator lista=[$($en.TextInfo.ListSeparator)] data scurta=[$($en.DateTimeFormat.ShortDatePattern)]"
foreach ($v in @("7.2", "6.8", "8.1", "7.5", "6.3", "7,2")) {
    foreach ($c in @($ro, $en)) {
        $d = 0.0
        $n = [double]::TryParse($v, [Globalization.NumberStyles]::Float, $c, [ref]$d)
        $dt = [datetime]::MinValue
        $t = [datetime]::TryParse($v, $c, [Globalization.DateTimeStyles]::None, [ref]$dt)
        "TryParse '$v' in $($c.Name): numar=$n ($d) | data=$t ($($dt.ToString('yyyy-MM-dd')))"
    }
}
