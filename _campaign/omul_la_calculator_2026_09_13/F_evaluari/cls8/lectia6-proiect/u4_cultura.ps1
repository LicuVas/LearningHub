# U4 (refolosit din lectia5-grafice, valorile din blocul „Copiaza” al lectiei 6): cum citeste Windows „7.50” pe ro-RO vs en-US.
# Datele regionale ale ACESTUI PC (.NET CultureInfo), NU ale laboratorului si NU parserul Excel.
$ro = [Globalization.CultureInfo]::GetCultureInfo("ro-RO")
$en = [Globalization.CultureInfo]::GetCultureInfo("en-US")
"Sursa: .NET CultureInfo pe acest PC, $(Get-Date -Format dd.MM.yyyy) - NU laboratorul"
"Cultura curenta a acestui PC: $((Get-Culture).Name)"
"ro-RO: separator zecimal=[$($ro.NumberFormat.NumberDecimalSeparator)] separator lista=[$($ro.TextInfo.ListSeparator)]"
"en-US: separator zecimal=[$($en.NumberFormat.NumberDecimalSeparator)] separator lista=[$($en.TextInfo.ListSeparator)]"
foreach ($v in @("7.50", "8.00", "6.50", "9.00", "5.50", "7,50")) {
    foreach ($c in @($ro, $en)) {
        $d = 0.0
        $n = [double]::TryParse($v, [Globalization.NumberStyles]::Float, $c, [ref]$d)
        $dt = [datetime]::MinValue
        $t = [datetime]::TryParse($v, $c, [Globalization.DateTimeStyles]::None, [ref]$dt)
        "TryParse '$v' in $($c.Name): numar=$n ($d) | data=$t"
    }
}
