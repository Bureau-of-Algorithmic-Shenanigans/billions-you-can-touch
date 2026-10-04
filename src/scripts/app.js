import { parseNum, wrapLabel, bucketOf, BUCKETS } from "../lib/pure.js";
import { I18N } from "../lib/i18n.js";



const ITEMS = [
  { id:"masken", icon:"l-mask", kind:"loss", group:"scandal",
    title:{de:"Spahns Masken-Deals",en:"Spahn's mask deals"},
    short:{de:"Corona-Maskenbeschaffung 2020",en:"COVID mask procurement, 2020"},
    who:{de:"Jens Spahn (CDU), Bundesgesundheitsminister 2018–2021",en:"Jens Spahn (CDU), Federal Health Minister 2018–2021"},
    context:{de:"Der Bund kaufte 5,8 Mrd. Schutzmasken für 5,9 Mrd. €. Nur 1,7 Mrd. wurden im Inland verteilt, mehr als die Hälfte wurde oder wird vernichtet. Der Bundesrechnungshof spricht von „massiver Überbeschaffung“. Aus dem Open-House-Verfahren (4,50 € je Maske) laufen rund 100 Klagen mit 2,3 Mrd. € Streitwert.",
             en:"The federal government bought 5.8 bn masks for €5.9 bn. Only 1.7 bn were distributed in Germany; more than half have been or will be destroyed. The Federal Audit Office calls it “massive over-procurement”. About 100 lawsuits worth €2.3 bn are still pending from the open-house procedure (€4.50 per mask)."},
    caveat:{de:"Ein Teil der Beschaffung war in der Notlage 2020 begründet. Wie viel davon „Schaden“ ist, ist politisch umstritten; die Klagen sind noch nicht entschieden.",
            en:"Some of the purchasing was justified by the 2020 emergency. How much of it counts as “damage” is politically disputed, and the lawsuits are undecided."},
    scen:{low:[0.517e9,{de:"Nur Folgekosten: Lagerung, Logistik, Vernichtung, Beratung (rund 517 Mio. €).",en:"Follow-up costs only: storage, logistics, destruction, consultants (about €517 m)."}],
          mid:[3.5e9,{de:"Folgekosten plus Kaufpreis der nie genutzten Masken (gut die Hälfte von 5,9 Mrd. €).",en:"Follow-up costs plus the purchase price of masks never used (just over half of €5.9 bn)."}],
          high:[5.8e9,{de:"Wie „Mittel“, und der Bund verliert alle Open-House-Klagen (2,3 Mrd. € Streitwert, ohne Zinsen).",en:"As “Middle”, plus the government loses every open-house lawsuit (€2.3 bn, before interest)."}]} },
  { id:"maut", icon:"l-signpost", kind:"loss", group:"scandal",
    title:{de:"Scheuers Pkw-Maut",en:"Scheuer's car toll"},
    short:{de:"Vom EuGH gestoppt, 2019",en:"Struck down by the ECJ, 2019"},
    who:{de:"Andreas Scheuer (CSU), Bundesverkehrsminister 2018–2021",en:"Andreas Scheuer (CSU), Federal Transport Minister 2018–2021"},
    context:{de:"Scheuer unterschrieb die Betreiberverträge, bevor der Europäische Gerichtshof entschieden hatte. Im Juni 2019 erklärte der EuGH die Maut für rechtswidrig, weil sie ausländische Fahrer benachteiligte. Der Bund zahlte den Betreibern Kapsch und CTS Eventim 243 Mio. € Schadensersatz, 2025 kamen weitere rund 27 Mio. € hinzu.",
             en:"Scheuer signed the operator contracts before the European Court of Justice had ruled. In June 2019 the ECJ declared the toll unlawful because it discriminated against foreign drivers. The government paid the operators Kapsch and CTS Eventim €243 m in damages, with about €27 m more added in 2025."},
    caveat:{de:"Das Ministerium verzichtete 2024 auf eine Regressklage gegen Scheuer persönlich.",
            en:"In 2024 the ministry decided not to sue Scheuer personally for recovery."},
    scen:{low:[0.243e9,{de:"Nur der Vergleich mit den Betreibern von 2023 (243 Mio. €).",en:"Only the 2023 settlement with the operators (€243 m)."}],
          mid:[0.27e9,{de:"Alle Zahlungen an die Betreiber, inklusive der 27 Mio. € im Haushalt 2025.",en:"All payments to the operators, including the €27 m in the 2025 budget."}],
          high:[0.33e9,{de:"Zusätzlich Berater-, Anwalts- und Vorbereitungskosten (Medienberichte: rund 330 Mio. € gesamt).",en:"Plus consultants, lawyers and preparation (press reports: about €330 m in total)."}]} },
  { id:"vermoegen", icon:"l-gem", kind:"gain", group:"reform", annual:1,
    title:{de:"Vermögensteuer einführen",en:"Introduce a wealth tax"},
    short:{de:"Seit 1997 ausgesetzt",en:"Suspended since 1997"},
    who:{de:"Gefordert u. a. von SPD-Linken, Grünen und Die Linke",en:"Proposed by, among others, the SPD left, the Greens and Die Linke"},
    context:{de:"Die Vermögensteuer wird seit 1997 nicht mehr erhoben, nachdem das Bundesverfassungsgericht die damalige Bewertung von Immobilien beanstandet hatte. Das Aufkommen hängt stark von Freibetrag und Steuersatz ab: Mit hohen Freibeträgen (z. B. 1 % ab 2 Mio. €) schätzte das DIW 10–20 Mrd. € pro Jahr.",
             en:"Germany stopped levying its wealth tax in 1997 after the Constitutional Court objected to how property was valued. Revenue depends heavily on the allowance and rate: with high allowances (e.g. 1% above €2 m), DIW estimated €10–20 bn a year."},
    caveat:{de:"Kritiker (u. a. ifo, IW) warnen vor Ausweichreaktionen, Kapitalabfluss, Belastung von Familienunternehmen und hohem Bewertungsaufwand. Das tatsächliche Aufkommen könnte deutlich niedriger liegen.",
            en:"Critics (including ifo and IW) warn of avoidance, capital flight, pressure on family firms and costly valuation. Actual revenue could be much lower."},
    scen:{low:[10e9,{de:"Untere DIW-Schätzung (2016) bei hohen Freibeträgen.",en:"Lower DIW estimate (2016) with high allowances."}],
          mid:[20e9,{de:"Obere DIW-Schätzung (2016) bei hohen Freibeträgen.",en:"Upper DIW estimate (2016) with high allowances."}],
          high:[100e9,{de:"Konzept der Linken (DIW-Berechnung 2026: 100–147 Mrd. €), hier mit 100 Mrd. € angesetzt.",en:"Die Linke's model (DIW calculation 2026: €100–147 bn), set at €100 bn here."}]} },
  { id:"erbschaft", icon:"l-scroll-text", kind:"gain", group:"reform", annual:1,
    title:{de:"Erbschaftsteuer durchsetzen",en:"Enforce the inheritance tax"},
    short:{de:"Ausnahmen für große Betriebsvermögen streichen",en:"End exemptions for large business assets"},
    who:{de:"Diskutiert in SPD, Grünen; Reformvorschläge u. a. vom DIW und Netzwerk Steuergerechtigkeit",en:"Debated in the SPD and Greens; reform proposals from DIW and the Tax Justice Network"},
    context:{de:"2024 nahm der Staat 13,3 Mrd. € Erbschaft- und Schenkungsteuer ein. Wer Betriebsvermögen über 26 Mio. € erbt, kann über die „Verschonungsbedarfsprüfung“ Steuern erlassen bekommen: 2024 sparten so allein 45 Großerben 3,4 Mrd. €. Hinzu kommen die regulären Verschonungsabschläge von 85 bzw. 100 %.",
             en:"In 2024 the state collected €13.3 bn in inheritance and gift tax. Heirs of business assets over €26 m can have tax waived via a “needs-based exemption”: in 2024, just 45 large heirs saved €3.4 bn this way. On top come the standard business-asset reliefs of 85% or 100%."},
    caveat:{de:"Wirtschaftsverbände (u. a. DIHK) argumentieren, die Verschonung schütze Arbeitsplätze in Familienunternehmen. Das IW hält hohe Mehreinnahmen für überschätzt.",
            en:"Business groups (e.g. DIHK) argue the exemptions protect jobs in family firms. IW considers high revenue expectations overblown."},
    scen:{low:[2.3e9,{de:"DIW-Reformmodell: Vergünstigungen abbauen, dafür höhere Freibeträge (rund 2,3 Mrd. € mehr).",en:"DIW reform model: cut privileges, raise allowances (about €2.3 bn more)."}],
          mid:[3.4e9,{de:"Nur die Verschonungsbedarfsprüfung abschaffen (erlassene Steuer 2024: 3,4 Mrd. €, Destatis).",en:"Abolish only the needs-based exemption (tax waived in 2024: €3.4 bn, Destatis)."}],
          high:[5.1e9,{de:"Alle Ausnahmen für Betriebsvermögen (§§ 13a–c ErbStG) streichen: rund 5,1 Mrd. € (Finanzwende).",en:"Remove all business-asset exemptions (§§ 13a–c ErbStG): about €5.1 bn (Finanzwende)."}]} },
  { id:"cumex", icon:"l-banknote", kind:"loss", group:"scandal",
    title:{de:"Cum-Ex-Steuerraub",en:"Cum-Ex tax heist"},
    short:{de:"Erstattung nie gezahlter Steuern, 2001–2012",en:"Refunds of tax never paid, 2001–2012"},
    who:{de:"Banken, Fonds, Anwälte und Investoren; die Gesetzeslücke wurde erst 2012 geschlossen",en:"Banks, funds, lawyers and investors; the loophole was only closed in 2012"},
    context:{de:"Bei Cum-Ex-Geschäften wurden Aktien rund um den Dividendenstichtag hin- und hergeschoben, bis sich mehrere Beteiligte eine nur einmal gezahlte Kapitalertragsteuer erstatten ließen. Der Bundesgerichtshof stufte das 2021 als Steuerhinterziehung ein. Zurückgeholt hat der Staat bisher nur einen Teil, laut Berichten über 1,8 Mrd. €.",
             en:"In Cum-Ex trades, shares were passed back and forth around the dividend date until several parties claimed refunds of a tax that had been paid only once. The Federal Court of Justice ruled it tax evasion in 2021. The state has recovered only part of it, reportedly over €1.8 bn."},
    caveat:{de:"Die Schätzungen liegen weit auseinander, je nachdem ob ähnliche Cum-Cum-Geschäfte mitgezählt werden. Politisch umstritten ist besonders der Umgang Hamburgs mit der Warburg-Bank.",
            en:"Estimates vary widely depending on whether similar Cum-Cum trades are included. Hamburg's handling of the Warburg bank remains politically disputed."},
    scen:{low:[5.3e9,{de:"Frühere Schätzung des Bundesfinanzministeriums.",en:"Earlier estimate by the Federal Finance Ministry."}],
          mid:[10e9,{de:"Schätzung von Prof. Christoph Spengel (Uni Mannheim), nur Cum-Ex.",en:"Estimate by Prof. Christoph Spengel (University of Mannheim), Cum-Ex only."}],
          high:[31.8e9,{de:"Spengel inklusive Cum-Cum-Geschäften, 2001–2016.",en:"Spengel including Cum-Cum trades, 2001–2016."}]} },
  { id:"gorchfock", icon:"l-sailboat", kind:"loss", group:"scandal",
    title:{de:"Gorch-Fock-Sanierung",en:"Gorch Fock refit"},
    short:{de:"Segelschulschiff der Marine, ab 2016",en:"Navy sail training ship, from 2016"},
    who:{de:"Bundesverteidigungsministerium (Ministerin Ursula von der Leyen, 2013–2019)",en:"Federal Defence Ministry (minister Ursula von der Leyen, 2013–2019)"},
    context:{de:"Die Überholung des 1958 gebauten Dreimasters sollte rund 10 Mio. € kosten und endete bei rund 135 Mio. €. Der Zustand des Schiffs war schlecht dokumentiert, die beauftragte Elsflether Werft ging 2019 in die Insolvenz, und es gab über 100 Ermittlungsverfahren wegen Korruption und Untreue.",
             en:"The overhaul of the 1958 three-master was meant to cost about €10 m and ended at about €135 m. The ship's condition was poorly documented, the contracted Elsfleth shipyard went insolvent in 2019, and over 100 corruption and fraud investigations followed."},
    caveat:{de:"Ein Teil der Arbeiten wäre bei ehrlicher Planung ohnehin fällig gewesen. Als Schaden zählt hier vor allem die Differenz zwischen Plan und Ergebnis.",
            en:"Some of the work would have been due anyway with honest planning. The damage here is mainly the gap between plan and result."},
    scen:{low:[125e6,{de:"Mehrkosten gegenüber dem ursprünglichen Plan (135 statt 10 Mio. €).",en:"Overrun against the original plan (€135 m instead of €10 m)."}],
          mid:[135e6,{de:"Gesamtkosten der Sanierung.",en:"Total cost of the refit."}]} },
  { id:"gastro", icon:"l-utensils-crossed", kind:"loss", group:"cost", annual:1,
    title:{de:"7 % Mehrwertsteuer fürs Restaurant",en:"7% VAT for restaurants"},
    short:{de:"Dauerhaft seit 1. Januar 2026",en:"Permanent since 1 January 2026"},
    who:{de:"Bundesregierung aus CDU/CSU und SPD",en:"CDU/CSU–SPD federal government"},
    context:{de:"Für Speisen im Restaurant gilt seit 2026 dauerhaft der ermäßigte Satz von 7 % statt 19 %. Bund, Ländern und Gemeinden fehlen dadurch rund 3,6 Mrd. € pro Jahr.",
             en:"Since 2026, restaurant meals are permanently taxed at the reduced 7% rate instead of 19%. Federal, state and local budgets lose about €3.6 bn a year."},
    caveat:{de:"Befürworter erwarten stabilere Preise und gesicherte Betriebe. Ob die Senkung bei den Gästen ankommt, ist umstritten.",
            en:"Supporters expect steadier prices and safer businesses. Whether diners see lower prices is disputed."},
    scen:{mid:[3.6e9,{de:"Steuerausfall laut Gesetzentwurf: 3,6 Mrd. € pro Jahr.",en:"Revenue loss according to the bill: €3.6 bn a year."}]} },
  { id:"dienstwagen", icon:"l-car-front", kind:"loss", group:"cost", annual:1,
    title:{de:"Dienstwagenprivileg",en:"Company-car tax break"},
    short:{de:"Die Ein-Prozent-Regel",en:"The one-percent rule"},
    who:{de:"Gilt seit 1996, von allen Regierungen beibehalten",en:"In place since 1996, kept by every government"},
    context:{de:"Wer einen Firmenwagen auch privat fährt, versteuert pauschal 1 % des Listenpreises pro Monat, egal wie viel privat gefahren wird. Eine Studie für das Umweltbundesamt beziffert die Steuerausfälle für 2024 auf mindestens 4,2 Mrd. €.",
             en:"Anyone who also drives a company car privately pays tax on a flat 1% of the list price per month, however much they drive. A study for the Federal Environment Agency puts the revenue loss for 2024 at no less than €4.2 bn."},
    caveat:{de:"Die Wirtschaft verweist auf den geringen Verwaltungsaufwand der Pauschale. Für E-Dienstwagen gelten noch niedrigere Sätze.",
            en:"Business groups point to how simple the flat rate is to administer. Electric company cars get even lower rates."},
    scen:{mid:[4.2e9,{de:"Mindestens 4,2 Mrd. € pro Jahr (Umweltbundesamt, 2024).",en:"At least €4.2 bn a year (Federal Environment Agency, 2024)."}]} },
  { id:"muetterrente", icon:"l-heart", kind:"loss", group:"cost", annual:1,
    title:{de:"Mütterrente III",en:"Mothers' pension III"},
    short:{de:"Geplant ab 2027",en:"Planned from 2027"},
    who:{de:"Kernforderung der CSU, im Koalitionsvertrag 2025",en:"Core CSU demand, in the 2025 coalition agreement"},
    context:{de:"Für vor 1992 geborene Kinder sollen Eltern genauso viele Rentenpunkte bekommen wie für später geborene. Laut Bundesregierung kostet das rund 5 Mrd. € pro Jahr. Wegen der technischen Umstellung soll das Geld erst 2028 fließen.",
             en:"Parents of children born before 1992 are to get the same pension credits as for children born later. The government puts the cost at about €5 bn a year. Because of the IT changes, payments are expected to start only in 2028."},
    caveat:{de:"Befürworter sehen darin Gerechtigkeit für ältere Mütter. Kritiker bemängeln, dass das Geld nicht gezielt gegen Altersarmut wirkt.",
            en:"Supporters see it as fairness for older mothers. Critics say the money is not targeted at poverty in old age."},
    scen:{mid:[5e9,{de:"Rund 5 Mrd. € pro Jahr laut Bundesregierung.",en:"About €5 bn a year according to the government."}]} },
  { id:"steuerfahndung", icon:"l-search", kind:"gain", group:"reform", annual:1,
    title:{de:"Steuerhinterziehung eintreiben",en:"Collect evaded taxes"},
    short:{de:"Mehr Steuerfahndung und Betriebsprüfung",en:"More tax investigators and audits"},
    who:{de:"Gefordert u. a. von der Deutschen Steuer-Gewerkschaft",en:"Demanded by, among others, the German tax officials' union"},
    context:{de:"Die Deutsche Steuer-Gewerkschaft schätzt die Ausfälle durch Steuerhinterziehung auf 50–60 Mrd. € pro Jahr. Schätzungen, die auch Mehrwertsteuerbetrug einrechnen, kommen auf 100 Mrd. € und mehr. In vielen Bundesländern fehlen Betriebsprüfer und Steuerfahnder.",
             en:"The tax officials' union estimates losses from tax evasion at €50–60 bn a year. Estimates that include VAT fraud reach €100 bn or more. Many federal states are short of auditors and tax investigators."},
    caveat:{de:"Niemand kann alles eintreiben. Die drei Werte sind Annahmen dieser Seite: welcher Anteil von 50 Mrd. € sich mit mehr Personal zurückholen ließe.",
            en:"Nobody can collect all of it. The three values are this page's assumptions about what share of €50 bn more staff could recover."},
    scen:{low:[5e9,{de:"Annahme: 10 % von 50 Mrd. € werden zusätzlich eingetrieben.",en:"Assumption: 10% of €50 bn is recovered."}],
          mid:[12.5e9,{de:"Annahme: 25 % von 50 Mrd. €.",en:"Assumption: 25% of €50 bn."}],
          high:[25e9,{de:"Annahme: 50 % von 50 Mrd. €.",en:"Assumption: 50% of €50 bn."}]} },
  { id:"ftt", icon:"l-trending-up", kind:"gain", group:"reform", annual:1,
    title:{de:"Finanztransaktionssteuer",en:"Financial transaction tax"},
    short:{de:"Steuer auf Börsengeschäfte inkl. Derivate",en:"Tax on trades incl. derivatives"},
    who:{de:"Gefordert u. a. von Finanzwende, SPD und Grünen",en:"Called for by Finanzwende, the SPD and the Greens"},
    context:{de:"Auf jeden Kauf und Verkauf von Aktien, Anleihen und Derivaten würde ein kleiner Steuersatz fällig. Finanzwende schätzt die Einnahmen inklusive Derivaten auf rund 17 Mrd. € im Jahr.",en:"A small tax would be due on every purchase and sale of shares, bonds and derivatives. Finanzwende estimates revenue including derivatives at about €17 bn a year."},
    caveat:{de:"Kritiker warnen, dass Handel ins Ausland abwandert und Kleinanleger mit Altersvorsorge mitbezahlen. Eine EU-weite Lösung scheitert seit Jahren.",en:"Critics warn that trading moves abroad and that small savers pay too. An EU-wide solution has stalled for years."},
    scen:{mid:[17e9,{de:"Schätzung von Finanzwende (inkl. Derivate).",en:"Finanzwende estimate (incl. derivatives)."}]} },
  { id:"splitting", icon:"l-users", kind:"gain", group:"reform", annual:1,
    title:{de:"Ehegattensplitting abschaffen",en:"Abolish joint taxation of spouses"},
    short:{de:"Individualbesteuerung für alle",en:"Individual taxation for everyone"},
    who:{de:"Vorschlag u. a. des DIW; diskutiert in SPD und Grünen",en:"Proposed by DIW, among others; debated in the SPD and the Greens"},
    context:{de:"Verheiratete Paare zahlen heute oft weniger Steuer, wenn eine Person deutlich mehr verdient als die andere. Mit vollständiger Individualbesteuerung rechnet das DIW mit rund 15,4 Mrd. € Mehreinnahmen pro Jahr.",en:"Married couples often pay less tax when one partner earns much more than the other. With full individual taxation, DIW expects about €15.4 bn more revenue a year."},
    caveat:{de:"Befürworter des Splittings sehen die Ehe als Wirtschaftsgemeinschaft geschützt. Für bestehende Ehen wären Übergangsregeln nötig, sonst steigt ihre Steuerlast abrupt.",en:"Supporters see marriage as an economic unit worth protecting. Existing marriages would need transition rules, or their tax bill would jump."},
    scen:{mid:[15.4e9,{de:"DIW, vollständige Individualbesteuerung.",en:"DIW, full individual taxation."}]} },
  { id:"reichensteuer", icon:"l-percent", kind:"gain", group:"reform", annual:1,
    title:{de:"Spitzensteuersatz auf 53 %",en:"Top tax rate up to 53%"},
    short:{de:"Reichensteuer wie bis 1999",en:"Wealth-earners' rate as before 1999"},
    who:{de:"Gefordert u. a. von Finanzwende und Die Linke",en:"Called for by Finanzwende and Die Linke"},
    context:{de:"Bis 1999 lag der Spitzensteuersatz bei 53 %. Ihn für sehr hohe Einkommen wieder darauf anzuheben, brächte laut Finanzwende rund 11,5 Mrd. € im Jahr.",en:"Until 1999 the top rate was 53%. Raising it back for very high incomes would bring about €11.5 bn a year, according to Finanzwende."},
    caveat:{de:"Wirtschaftsverbände warnen vor Nachteilen für Personengesellschaften und vor Abwanderung von Fachkräften und Unternehmern.",en:"Business groups warn about harm to partnerships and about skilled workers and entrepreneurs leaving."},
    scen:{mid:[11.5e9,{de:"Schätzung von Finanzwende.",en:"Finanzwende estimate."}]} },
  { id:"kerosin", icon:"l-plane", kind:"gain", group:"reform", annual:1,
    title:{de:"Kerosinsteuer einführen",en:"Introduce a jet fuel tax"},
    short:{de:"EU-weit, auch für internationale Flüge",en:"EU-wide, incl. international flights"},
    who:{de:"Gefordert u. a. vom Verkehrsclub VCD und Umweltverbänden",en:"Called for by the transport club VCD and environmental groups"},
    context:{de:"Autofahrer zahlen Energiesteuer auf Benzin und Diesel, Fluggesellschaften auf Kerosin nicht. Eine EU-weite Kerosinsteuer inklusive internationaler Flüge brächte Deutschland rund 6 Mrd. € im Jahr.",en:"Drivers pay energy tax on petrol and diesel, airlines pay none on jet fuel. An EU-wide jet fuel tax incl. international flights would bring Germany about €6 bn a year."},
    caveat:{de:"Airlines und Flughäfen warnen vor teureren Tickets und Verlagerung an Drehkreuze außerhalb der EU.",en:"Airlines and airports warn of pricier tickets and traffic moving to hubs outside the EU."},
    scen:{mid:[6e9,{de:"Schätzung des VCD.",en:"VCD estimate."}]} },
  { id:"rente70", icon:"l-armchair", kind:"gain", group:"reform", annual:1,
    title:{de:"Rente mit 70",en:"Retire at 70"},
    short:{de:"Renteneintrittsalter von 67 auf 70",en:"Retirement age from 67 to 70"},
    who:{de:"Diskutiert u. a. von Ökonomen des ifo-Instituts und Teilen von CDU und FDP",en:"Discussed by ifo economists and parts of the CDU and FDP"},
    context:{de:"Wer erst mit 70 in Rente geht, zahlt länger ein und bezieht kürzer Rente. Das senkt den Bundeszuschuss zur Rentenversicherung nach ifo-Zahlen um rund 18 Mrd. € im Jahr.",en:"Retiring at 70 means paying in longer and drawing a pension for less time. Based on ifo figures, that cuts the federal pension subsidy by about €18 bn a year."},
    caveat:{de:"Gewerkschaften und Sozialverbände sehen darin eine Rentenkürzung, besonders für Menschen in körperlich harten Berufen, die nicht bis 70 arbeiten können.",en:"Unions and social groups call it a pension cut, especially for people in physically hard jobs who cannot work until 70."},
    scen:{mid:[18e9,{de:"Ersparnis beim Bundeszuschuss auf ifo-Basis, hier als jährliche Entlastung gezählt.",en:"Saving on the federal subsidy, ifo basis, counted here as annual relief."}]} },
  { id:"pendler", icon:"l-route", kind:"gain", group:"reform", annual:1,
    title:{de:"Pendlerpauschale abschaffen",en:"Abolish the commuter allowance"},
    short:{de:"Keine Steuerentlastung mehr für den Arbeitsweg",en:"No more tax relief for the commute"},
    who:{de:"Vorschlag u. a. von Umweltverbänden; in vielen Subventionsberichten gelistet",en:"Proposed by environmental groups; listed in many subsidy reports"},
    context:{de:"Wer zur Arbeit pendelt, kann heute 38 Cent pro Kilometer von der Steuer absetzen. Ohne diese Pauschale nähme der Staat laut Subventionsbericht rund 5,9 Mrd. € im Jahr mehr ein.",en:"Commuters can currently deduct 38 cents per km from their taxable income. Without it, the state would collect about €5.9 bn more a year, according to the subsidy report."},
    caveat:{de:"Besonders Menschen auf dem Land ohne Bus und Bahn würden belastet. Das Bundesverfassungsgericht hat 2008 eine teilweise Streichung bereits gekippt.",en:"People in the countryside without public transport would be hit hardest. The Constitutional Court struck down a partial cut in 2008."},
    scen:{mid:[5.9e9,{de:"Subventionsbericht des Bundesfinanzministeriums.",en:"Federal subsidy report."}]} },
  { id:"mwst21", icon:"l-receipt", kind:"gain", group:"reform", annual:1,
    title:{de:"Mehrwertsteuer auf 21 %",en:"VAT up to 21%"},
    short:{de:"Regelsatz von 19 auf 21 %",en:"Standard rate from 19% to 21%"},
    who:{de:"Diskutiert von Ökonomen als Gegenfinanzierung für Entlastungen",en:"Discussed by economists to fund tax cuts elsewhere"},
    context:{de:"Zwei Prozentpunkte mehr Mehrwertsteuer auf alles, was heute mit 19 % besteuert wird, brächten rund 32 Mrd. € im Jahr.",en:"Two percentage points more VAT on everything currently taxed at 19% would bring about €32 bn a year."},
    caveat:{de:"Die Mehrwertsteuer trifft Menschen mit kleinem Einkommen anteilig stärker, weil sie mehr von ihrem Geld ausgeben. Höhere Preise können die Inflation antreiben.",en:"VAT hits low incomes harder, because they spend a larger share of their money. Higher prices can push up inflation."},
    scen:{mid:[32e9,{de:"Grobe Schätzung für zwei Prozentpunkte mehr Mehrwertsteuer.",en:"Rough estimate for two more percentage points of VAT."}]} },
  { id:"feiertag", icon:"l-calendar-x", kind:"gain", group:"reform", annual:1,
    title:{de:"Einen Feiertag streichen",en:"Scrap one public holiday"},
    short:{de:"Ein Arbeitstag mehr im Jahr",en:"One more working day a year"},
    who:{de:"Vorschlag u. a. des Instituts der deutschen Wirtschaft (IW)",en:"Proposed by the German Economic Institute (IW), among others"},
    context:{de:"1995 wurde der Buß- und Bettag gestrichen, um die Pflegeversicherung zu finanzieren. Ein zusätzlicher Arbeitstag bringt mehr Wirtschaftsleistung und laut IW rund 1,5 Mrd. € zusätzliche Steuereinnahmen im Jahr.",en:"In 1995 a public holiday was scrapped to fund long-term care insurance. One extra working day adds output and, according to IW, about €1.5 bn in tax revenue a year."},
    caveat:{de:"Gewerkschaften und Kirchen lehnen das ab. Ob ein Tag mehr Arbeit wirklich so viel mehr Wirtschaftsleistung bringt, ist unter Ökonomen umstritten.",en:"Unions and churches oppose it. Economists disagree on whether one more working day really adds that much output."},
    scen:{mid:[1.5e9,{de:"Schätzung des IW Köln.",en:"IW Cologne estimate."}]} },
  { id:"custom", icon:"l-calculator", kind:"custom", group:"custom",
    title:{de:"Eigener Betrag",en:"Your own amount"},
    short:{de:"Zum Beispiel eine Zeitungsmeldung",en:"Say, a number from the news"},
    who:{de:"",en:""}, context:{de:"Gib einen beliebigen Betrag in Milliarden Euro ein.",en:"Enter any amount in billions of euros."}, caveat:{de:"",en:""}, scen:{} }
];
// Further budget proposals for the 2027 federal budget: [code, area, effect in € bn/yr, title, source].
// Sign as in the simulator: on the revenue side + = more revenue; in spending areas + = more spending. Duplicates of our own topics are left out.
const HL=[["RENT48R","soziales",-0.5,"Rentenniveau-Festschreibung 48% zurücknehmen (Nachhaltigkeitsfaktor reaktivieren)","https://www.tagesschau.de/inland/fratzscher-reformpaket-bundesregierung-100.html"],["MTRABS9","soziales",-13.5,"Mütterrente ganz abschaffen (auch Mütterrente I/II)","https://www.zeit.de/politik/deutschland/2026-02/muetterrente-schwarz-rote-koalition-kosten"],["DPBHSAH","soziales",-0.086,"Bürgergeld radikal kürzen","https://www.tagesschau.de/inland/innenpolitik/buergergeld-gesetzentwurf-100.html"],["MINDSCH","soziales",16.4,"Armutsfeste Mindestsicherung (Paritätischer Wohlfahrtsverband)","https://www.der-paritaetische.de/alle-meldungen/debatte-um-buergergeld-paritaetischer-legt-aktuelle-berechnungen-fuer-armutsfesten-regelsatz-vor/"],["XTHV3A3","soziales",5,"Kindergrundsicherung einführen","https://www.bundestag.de/dokumente/textarchiv/2023/kw45-pa-pet-kindergrundsicherung-974196"],["ZMF8MDD","soziales",-0.9,"Elterngeld: Einkommensgrenze absenken (175k → 100k)","https://taz.de/Debatten-um-Bundeshaushalt/!6181914/"],["4V30T9N","soziales",-1.1,"Elterngeld: Bezugsdauer kürzen (14 → 12 Monate)","https://taz.de/Debatten-um-Bundeshaushalt/!6181914/"],["791G0OL","soziales",0.4,"Kostenlose Periodenprodukte in öffentlichen Einrichtungen (Schottland-Modell)","https://www.plan.de/magazin/artikel/aktuelles/sprechen-wir-ueber-periodenarmut.html?sc=IDQ27200"],["EIPOQCM","soziales",0.8,"Periodenprodukte: Ausweitung auf breite Versorgung Bedürftiger","https://www.ndr.de/nachrichten/hamburg/initiative-kaempft-fuer-kostenlose-menstruationsprodukte,period-102.html"],["ALG18MT","soziales",-1.4,"Arbeitslosengeld für Ältere auf 18 Monate begrenzen","https://www.handelsblatt.com/politik/deutschland/arbeitsmarkt-kuerzeres-arbeitslosengeld-fuer-aeltere-koenntemilliarden-sparen-01/100254612.html"],["ALG12MT","soziales",-1,"Weiter verschärfen: Arbeitslosengeld für alle einheitlich 12 Monate","https://www.handelsblatt.com/politik/deutschland/arbeitsmarkt-kuerzeres-arbeitslosengeld-fuer-aeltere-koenntemilliarden-sparen-01/100254612.html"],["NNHJ7XV","verteidigung",4,"Allgemeine Wehrpflicht wieder einführen","https://www.ifo.de/pressemitteilung/2024-07-10/wiedereinfuehrung-der-wehrpflicht"],["T3W5UZB","verteidigung",25,"NATO-Ziel auf 3% BIP steigern","https://www.spiegel.de/wirtschaft/soziales/haushalt-2027-lars-klingbeil-legt-entwurf-mit-555-milliarden-euro-ausgaben-vor-a-0e70bc5a-2da0-4778-a438-f55124b596a7"],["IKCIDKW","verteidigung",-42,"Verteidigung auf 1,5% BIP reduzieren","https://www.destatis.de"],["UKRSTR7","finanzverwaltung",-11.6,"Ukraine-Hilfe streichen","https://dserver.bundestag.de/btd/21/073/2107300.pdf"],["UKRVDP7","finanzverwaltung",11.6,"Ukraine-Hilfe verdoppeln (auf 23,2 Mrd. €)","https://dserver.bundestag.de/btd/21/073/2107300.pdf"],["KOMUST7","finanzverwaltung",33,"Gemeindeanteil an der Umsatzsteuer um 10 Prozentpunkte erhöhen (Deutscher Städtetag)","https://www.staedtetag.de/files/dst/docs/Presse/2026/dresdner-impulse-2026.pdf"],["G0FN9XU","zinsen",10,"Tilgungsprogramm starten (aktiver Schuldenabbau)","https://www.iwkoeln.de/studien/martin-beznoska-tobias-hentze-ein-tilgungsplan-fuer-deutschlands-staatsschulden-zur-begrenzung-der-zinslast.html"],["H75LXO6","verkehr",-5,"Neubau von Autobahnen stoppen","https://www.bundesfinanzministerium.de/Content/DE/Pressemitteilungen/Finanzpolitik/2025/07/2025-07-31-sanierung-autobahninfrastruktur.html"],["BSTRUW1","verkehr",-1.5,"Autobahn-Neubaustopp — auch unwirtschaftliche Bundesstraßen-Neubauprojekte streichen","https://foes.de/publikationen/2026/2026-06_FOES-Autobahnneubau.pdf"],["QJIUJV6","verkehr",12,"Bahn-Investitionen verdoppeln","https://www.spiegel.de/wirtschaft/unternehmen/deutsche-bahn-plant-2026-mit-mehr-als-23-milliarden-euro-fuer-das-schienennetz-a-c8d7dac9-2b53-40a2-8161-262e630e09ef"],["FVG7B2H","verkehr",0.2,"Fernverkehrsgarantie in der Fläche (Bund bestellt SPFV)","https://www.gruene-bundestag.de/unsere-politik/was-unsere-politik-fuer-dich-bedeutet/fernverkehr-unser-gesetz-bringt-den-intercity-zurueck-in-deinen-bahnhof/"],["OH9SDBD","verkehr",-1.5,"Deutschlandticket abschaffen","https://www.bundestag.de/dokumente/textarchiv/2025/kw45-de-regionalisierungsgesetz-1118560"],["9EURTKT","verkehr",8.5,"9-Euro-Ticket wiedereinführen (statt Deutschlandticket 63 €/Monat)","https://www.zdfheute.de/politik/deutschland/9-euro-ticket-verkehr-auto-zug-verspaetungen-ifo-100.html"],["66FXLO0","gesundheit",0.5,"Bundeszuschuss zur GKV regelgebunden dynamisieren (statt fixer Betrag)","https://www.bundesgesundheitsministerium.de/fileadmin/Dateien/3_Downloads/F/FinanzKommission_Gesundheit/FinanzKommissionGesundheit_Erster_Bericht_20260330.pdf"],["W2PCN9T","gesundheit",5,"Zusätzlich: Bundeszuschuss an GKV diskretionär um 5 Mrd. aufstocken","https://www.bundesgesundheitsministerium.de/ministerium/meldungen/finanzentwicklung-gkv-2025"],["84AZYTJ","gesundheit",3,"Pflegereform: Eigenanteil deckeln","https://www.pkv.de/verband/presse/meldungen/eigenanteile-in-der-pflege-so-teuer-waere-der-kostendeckel/"],["08MGHLS","gesundheit",12,"Kostendeckende GKV-Beiträge für Bürgergeldbeziehende","https://www.bundesgesundheitsministerium.de/fileadmin/Dateien/3_Downloads/F/FinanzKommission_Gesundheit/FinanzKommissionGesundheit_Erster_Bericht_20260330.pdf"],["XEPQ85J","gesundheit",-5,"GKV-Beitrag erhöhen statt Bundeszuschuss","https://www.bundesgesundheitsministerium.de/presse/pressemitteilungen/krankenkassen-erhoehen-die-beitraege"],["WARKEN7","gesundheit",7,"Warken-Sparpaket im Gesundheitsetat zurücknehmen","https://www.spiegel.de/wirtschaft/soziales/haushalt-2027-lars-klingbeil-legt-entwurf-mit-555-milliarden-euro-ausgaben-vor-a-0e70bc5a-2da0-4778-a438-f55124b596a7"],["BVBEAM7","gesundheit",-3.2,"Bürgerversicherung: Beamte in die GKV integrieren (PKV/Beihilfe auslaufen lassen)","https://www.iges.com/ergebnisse/projekte/2017/beamte-und-krankenversicherung/index_ger.html"],["SG65KXV","bildung",-4,"Studiengebühren bundesweit einführen (1.500 €/Semester)","https://www.bpb.de/themen/bildung/dossier-bildung/200978/studiengebuehren-oder-studium-aus-oeffentlichen-mitteln/"],["F1T2TAL","bildung",3,"BAföG auf 1.500 €/Monat erhöhen","https://www.stuttgarter-zeitung.de/inhalt.bafoeg-koalitionsvertrag-neuerungen-2026-mhsd.5a89464a-d13e-4e78-9f6d-d5f1c31f7d04.html"],["A753LC5","bildung",-5,"Forschungsetat um 25% kürzen","https://www.bundestag.de/presse/hib/kurzmeldungen-1127266"],["ZKVTRAG","bildung",0.5,"Zukunftsvertrag Studium und Lehre erhöhen","https://www.gwk-bonn.de/themen/foerderung-von-hochschulen/hochschulpakt-zukunftsvertrag/zukunftsvertrag"],["EXZLNZS","bildung",0.7,"Exzellenzstrategie ausweiten (mehr Universitäten fördern)","https://www.dfg.de/de/foerderung/foerderinitiativen/exzellenzstrategie"],["DIG2PK1","bildung",1,"Digitalpakt Schulen 2.0 finanzieren","https://www.bmftr.bund.de/DE/Bildung/DigitalPakt-Schule/digitalpakt-schule_node.html"],["0IEM8UO","bildung",12,"Kostenloses Mittagessen an staatlichen Kitas und Schulen","https://www.bundestag.de/webarchiv/Ausschuesse/ausschuesse20/weitere_gremien/buergerraete/buergerrat_th1/kostenloses-essen-schule-kitas-991914"],["MSTRBFG","bildung",1.5,"Meister-BAföG (AFBG) deutlich ausbauen","https://www.bmftr.bund.de/DE/Bildung/BeruflicheBildung/Aufstiegsfoerderung/Aufstiegsbafoeg/aufstiegsbafoeg_node.html"],["KIFORMD","bildung",2.5,"KI-Forschungsoffensive verdoppeln","https://www.bmftr.bund.de/DE/Forschung/Schluessel-und-Zukunftstechnologien/KuenstlicheIntelligenz/kuenstlicheintelligenz_node.html"],["8DRC11E","inneres",3,"Grenzschutz massiv ausbauen","https://www.bundesfinanzministerium.de/Content/DE/Pressemitteilungen/Finanzpolitik/2025/07/2025-07-30-regierungsentwurf-bundeshaushalt-2026.html"],["RTJ5PHT","inneres",1.8,"Bundespolizei aufstocken (+10.000 Stellen)","https://www.spiegel.de/wirtschaft/bundeshaushalt-2026-ministerien-fordern-ueber-30-milliarden-euro-zusaetzlich-a-64cddce4-981b-4655-ac6d-b3cdaa107cc9"],["INETRZ7","inneres",-0.95,"Erhöhung des Innenetats zurücknehmen","https://www.tagesschau.de/inland/innenpolitik/haushalt-bundestag-dobrindt-100.html"],["EHVDP10","entwicklung",10,"Entwicklungshilfe verdoppeln (auf ~20 Mrd. EUR/Jahr)","https://www.mitmischen.de/parlament/geld/haushalt-2026-wofuer-ist-wie-viel-geld-eingeplant"],["0HL9XPS","entwicklung",12,"Entwicklungshilfe weiter aufstocken auf UN-Ziel 0,7 % BIP (~31,5 Mrd. EUR/Jahr)","https://www.destatis.de"],["EIMVIHC","entwicklung",-5,"Entwicklungshilfe halbieren","https://www.mitmischen.de/parlament/geld/haushalt-2026-wofuer-ist-wie-viel-geld-eingeplant"],["AFDBMZ7","entwicklung",-2.5,"Weiter kürzen: Entwicklungshilfe um 80 % senken und BMZ auflösen (AfD-Antrag)","https://dserver.bundestag.de/btd/21/069/2106906.pdf"],["BMZHSC1","entwicklung",0.03,"BMZ-Hochschulprogramme erhalten (EPOS + DAAD-Partnerschaften)","https://www.tagesspiegel.de/wissen/wenig-sparen-viel-verlieren-die-bundesregierung-zerstort-geopolitisch-bedeutsame-netzwerke-15744856.html"],["WI64CIY","wohnen",3,"Sozialen Wohnungsbau verdoppeln","https://www.bundestag.de/dokumente/textarchiv/2025/kw48-de-wohnen-1126090"],["HE7UR23","wohnen",0.9,"Agrardiesel-Förderung wiederherstellen","https://www.wirtschaftsdienst.eu/inhalt/jahr/2024/heft/4/beitrag/die-abschaffung-der-steuerlichen-beguenstigung-von-agrardiesel-ist-ueberfaellig.html"],["GDPPQ0Y","wohnen",1,"Ökolandbau-Förderung ausbauen (Ziel: 30% bis 2030)","https://www.bmel.de/DE/themen/landwirtschaft/oekologischer-landbau/oekolandbau_node.html"],["9DOM5IG","wohnen",2,"Wohngeld weiter ausbauen (mehr Haushalte berechtigen, über Vor-Reform-Niveau hinaus)","https://www.bmwsb.bund.de/SharedDocs/pressemitteilungen/DE/2025/11/haushalt.html"],["WGRUE27","wohnen",2,"Rücknahme Wohngeld-Kürzung 2027 (Kabinettsbeschluss)","https://www.spiegel.de/wirtschaft/soziales/wohngeld-die-regierung-kuerzt-drastisch-und-trifft-damit-vor-allem-kinder"],["QPKI7P5","verwaltung",2,"Verwaltungsdigitalisierung beschleunigen (OZG vollenden)","https://www.insm.de/aktuelles/publikationen/digitale-transformation-deutschland-scheitert-beim-e-government"],["TB94874","verwaltung",-1,"Bundesbehörden konsolidieren (Doppelstrukturen abbauen)","https://www.bundestag.de/dokumente/textarchiv/2025/kw46-pa-haushalt-bereinigung-1126856"],["FRHOCN9","verwaltung",-0.2,"Bundestag verkleinern (von 630 auf 400 Sitze)","https://www.bundestag.de/dokumente/textarchiv/2025/kw46-pa-haushalt-bereinigung-1126856"],["ALIMB27","verwaltung",3.5,"Bundesalimentationsgesetz umsetzen (verfassungskonforme Beamtenbesoldung, BMI 2026)","https://www.dbwv.de/aktuelle-themen/verband-aktuell/beitrag/stellungnahme-des-dbwv-zum-bundesalimentationsgesetz"],["BUEROB7","verwaltung",-0.5,"Bürokratieabbau nach 2. Entlastungskabinett (BMDS 2026)","https://bmds.bund.de/themen/staatsmodernisierung/buerokratierueckbau/2-entlastungskabinett"],["ATOMREK","sonstige_ressorts",1,"Atomkraft-Wiedereinstieg Szenario A — Reaktivierung Isar 2, Emsland, Neckarwestheim 2","https://www.base.bund.de/de/nukleare-sicherheit/atomausstieg/abgeschaltete-akw/2022/die-drei-letzten-akw_inhalt.html"],["ATOMNEU","sonstige_ressorts",5,"Atomkraft-Wiedereinstieg Szenario B — Neubau von 2-3 EPR-Reaktoren (analog Hinkley Point C)","https://www.nzz.ch/international/kernkraft-comeback-in-deutschland-so-viel-kostet-der-wiedereinstieg-ld.1860950"],["QJXCUYV","sv_ktf",-0.75,"E-Auto-Förderung streichen (bis 2029)","https://www.t-online.de/finanzen/aktuelles/wirtschaft/id_101090442/e-auto-praemie-experten-und-umweltverbaende-ueben-scharfe-kritik.html"],["7M4NLS4","sv_ktf",2.5,"Bundesförderung effiziente Gebäude (BEG) um 2,5 Mrd. €/Jahr aufstocken","https://ariadneprojekt.de/publikation/analyse-energieberatung-als-hebel-fur-die-klimawende/"],["Z6WKZW5","sv_ktf",1.1,"Bundesförderung effiziente Wärmenetze (BEW) auf 3 Mrd. €/Jahr dauerhaft aufstocken","https://www.zfk.de/energie/waermewende/waermenetz-foerderung-bew-2027-spuerbar-aufstocken"],["KLMGLD7","sv_ktf",14,"Klimageld einführen (CO2-Preis-Einnahmen pro Kopf zurückzahlen)","https://www.diw.de/de/diw_01.c.874267.de/co2-bepreisung__klimageld_wuerde_insbesondere_einkommensschwachen_haushalten_helfen.html"],["INDSTR7","sv_ktf",-1.5,"Industriestrompreis / Brückenstrompreis streichen (5 ct/kWh-Deckel für energieintensive Industrie)","https://www.produktion.de/wirtschaft/industriestrompreis-soll-wettbewerbsfaehigkeit-sichern/2121401"],["DIWERB7","einnahmen",2.3,"Erbschaftsteuer nach DIW-Modell reformieren (Vergünstigungen abbauen, höhere Lebensfreibeträge, 4 Tarifstufen)","https://www.diw.de/de/diw_01.c.996032.de/publikationen/wochenberichte/2026_04_1/erbschaftsteuerreform__verguenstigungen_abbauen__freibetraege_erhoehen__steuertarifstufen_reduzieren.html"],["ZFK8UT0","einnahmen",2,"CumEx/CumCum-Steuerraub konsequent bekämpfen und zurückfordern","https://www.finanzwende.de/themen/steuergerechtigkeit/die-zehn-wichtigsten-steuerprivilegien-und-die-80-milliarden-euro"],["CVS4F8C","einnahmen",6,"Immobiliengewinne besteuern (Spekulationssteuer abschaffen)","https://www.finanzwende.de/themen/steuergerechtigkeit/die-zehn-wichtigsten-steuerprivilegien-und-die-80-milliarden-euro"],["GVYIE6I","einnahmen",17,"Unternehmensgewinne aus Steueroasen besteuern","https://www.finanzwende.de/themen/steuergerechtigkeit/die-zehn-wichtigsten-steuerprivilegien-und-die-80-milliarden-euro"],["VWPVS7H","einnahmen",6,"Gewinne in Familienholdings besteuern","https://www.finanzwende.de/themen/steuergerechtigkeit/die-zehn-wichtigsten-steuerprivilegien-und-die-80-milliarden-euro"],["BS1XQGS","einnahmen",0.5,"Anzahl der gesetzlichen Feiertage bundesweit vereinheitlichen (auf niedrigstes Ländermaß)","https://www.iwkoeln.de/presse/iw-nachrichten/christoph-schroeder-ein-zusaetzlicher-arbeitstag-bringt-bis-zu-86-milliarden-euro.html"],["1HIE341","einnahmen",33,"Fahrleistungsabhängige PKW-Maut einführen (Agora-Modell, zusätzlich zu bestehenden Steuern)","https://www.agora-verkehrswende.de/veroeffentlichungen/pkw-maut-fuer-die-mobilitaetswende/"],["EUMZ7BI","einnahmen",2.5,"Stromsteuerbegünstigung für produzierendes Gewerbe und Land-/Forstwirtschaft aufheben (§ 9b StromStG)","https://www.bundesfinanzministerium.de/Content/DE/Downloads/Broschueren_Bestellservice/30-subventionsbericht.pdf"],["P3ID2QN","einnahmen",0.451,"Tonnagebesteuerung für Handelsschiffe abschaffen (§ 5a EStG)","https://www.bundesfinanzministerium.de/Content/DE/Downloads/Broschueren_Bestellservice/30-subventionsbericht.pdf"],["1IVMAT9","einnahmen",1.381,"Steuerbefreiung für Sonntags-, Feiertags- und Nachtarbeitszuschläge streichen (§ 3b EStG)","https://www.bundesfinanzministerium.de/Content/DE/Downloads/Broschueren_Bestellservice/30-subventionsbericht.pdf"],["126DAKE","einnahmen",0.43,"Agrardiesel-Steuerbegünstigung: verbliebene Rest-Entlastung nach § 57 EnergieStG vollständig streichen","https://www.bundesfinanzministerium.de/Content/DE/Downloads/Broschueren_Bestellservice/30-subventionsbericht.pdf"],["N1543AJ","einnahmen",0.49,"Kfz-Steuerbefreiung für Land- und Forstwirtschaft abschaffen (§ 3 Nr. 7 KraftStG)","https://www.bundesfinanzministerium.de/Content/DE/Downloads/Broschueren_Bestellservice/30-subventionsbericht.pdf"],["JRFD10P","einnahmen",0.432,"Kerosinsteuer auf inländischen Flugverkehr einführen (§ 27 Abs. 2 EnergieStG streichen)","https://www.bundesfinanzministerium.de/Content/DE/Downloads/Broschueren_Bestellservice/30-subventionsbericht.pdf"],["VERFRBS","einnahmen",0.345,"Vereinsfreibetrag senken + Veräußerungsfreibeträge streichen (BMF-Referentenentwurf 2027)","https://www.mdr.de/nachrichten/deutschland/politik/vereine-steuern-lars-klingbeil-steuerfreibetrag,steuererhoehung-100.html"],["GKVMITV","einnahmen",3.5,"GKV: Beitragsfreie Mitversicherung Ehepartner abschaffen","https://www.versicherungsjournal.de/markt-und-politik/laender-wollen-wegfall-der-gkv-familienversicherung-abfedern-156029"],["755NF4Z","einnahmen",1.5,"Mieteinnahmen: Gewerbesteuer-Ausnahme streichen","https://www.finanzwende.de/themen/steuergerechtigkeit/die-zehn-wichtigsten-steuerprivilegien-und-die-80-milliarden-euro"],["W9XA3KX","einnahmen",5,"Abgeltungsteuer abschaffen (Kapitalerträge normal besteuern)","https://www.netzwerk-steuergerechtigkeit.de/jahrbuch/"],["DPJA1WJ","einnahmen",1,"Reichensteuer weiter anheben: 47% ab 280.000 € → 48%","https://www.bundestag.de/presse/hib/kurzmeldungen-1050526"],["ZKRST27","einnahmen",0.95,"Zuckersteuer nach Klingbeil-Entwurf einführen (ab 01.07.2027, 26-38 ct/L; vom Kanzleramt vorerst gestoppt)","https://www.t-online.de/nachrichten/deutschland/innenpolitik/id_101461236/-nicht-mehrheitsfaehig-kanzleramt-stoppt-klingbeils-zuckersteuer-entwurf.html"],["NSTZFI7","einnahmen",3.05,"Zuckersteuer auf Finnland-Niveau ausweiten (0,59 €/L auf alle zuckerhaltigen Getränke)","https://www.netzwerk-steuergerechtigkeit.de/jahrbuch/"],["ZKAUSW8","einnahmen",0.2,"Zuckersteuer auf Light-/Zero-Getränke, Nektar, Smoothies und Haferdrinks ausweiten","https://www.tagesschau.de/inland/innenpolitik/bundesregierung-zuckersteuer-ausweitung-100.html"],["T4UFEL6","einnahmen",36,"Schuldenbremse weiter lockern für Investitionen (+36 Mrd. Kreditspielraum)","https://de.finance.yahoo.com/nachrichten/reform-schuldenbremse-expertenkommission-hat-laut-065540856.html"],["246HID2","einnahmen",0.3,"Flugticketsteuer-Senkung rückgängig machen","https://taz.de/Debatten-um-Bundeshaushalt/!6181914/"],["TBKST26","einnahmen",-0.8,"Rücknahme Klingbeil-Tabaksteuer-Stufenerhöhung 2027-2030","https://www.t-online.de/finanzen/aktuelles/wirtschaft/id_101328070/tabaksteuer-wirtschaft-nennt-klingbeils-milliarden-plan-blindflug-.html"],["TBKNSC7","einnahmen",0.8,"Nachschärfung Tabaksteuer 2027-2030 (BMF-Papier 08.07.2026, noch nicht beschlossen)","https://www.spiegel.de/wirtschaft/neue-plaene-der-regierung-12-euro-fuer-eine-packung-zigaretten-tabaksteuer-soll-noch-staerker-erhoeht-werden-a-ce013cce-c4c3-46f6-8c83-85e000dcd57e"],["VGU7RN7","einnahmen",0.125,"Strafsteuer auf Privatjet-Flüge (1.000 € pro Start)","https://taz.de/Fluege-mit-Privatjets-im-Jahr-2024/!6078574/"],["VR0SR0T","einnahmen",1.4,"EU-Plastikabgabe an Produzenten von Plastikverpackungen weiterberechnen","https://plasticseurope.org/de/nachhaltigkeit/kreislaufwirtschaft/abfallmanagement-und-abfallvermeidung/plastiksteuer/"],["R92NX4V","einnahmen",1.4,"Alkoholsteuer erhöhen (+10 Cent pro Bier)","https://taz.de/Sollte-Alkohol-hoeher-besteuert-werden/!6127737/"],["BOJ1NHK","einnahmen",-1.6,"Energiesteuer-Senkung (Tankrabatt) wie 2026 wiederholen","https://www.bundestag.de/dokumente/textarchiv/2026/kw17-de-energiesteuersenkung-1165890"],["5OWF759","einnahmen",-9,"Unternehmenssteuer von 15% auf 10% senken","https://www.bundesregierung.de/breg-de/aktuelles/wachstumsbooster-2351752"],["KOAEST7","einnahmen",5,"Rücknahme Koa-Reform: Einkommensteuer-Entlastung streichen (nur diskretionäre Teile)","https://table.media/berlin/talk-of-the-town/koalitionsausschuss-fuer-welche-einkommensgruppen-die-steuerplaene-entlastung-bringen"],["KOARST7","einnahmen",-3,"Rücknahme Koa-Reform: Reichensteuer-Verschärfung streichen","https://table.media/berlin/talk-of-the-town/koalitionsausschuss-fuer-welche-einkommensgruppen-die-steuerplaene-entlastung-bringen"],["KOAMJB7","einnahmen",-1,"Rücknahme Koa-Reform: Minijob-Pauschale bei 2% belassen","https://www.beck-aktuell.de/heute-im-recht/rechtspolitik-gesetzgebung/koalitionsausschuss-reformbeschluesse-steuern-kindergeld-kinderfreibetrag-minijobs-2026-07-02"],["KOAHWB7","einnahmen",-0.7,"Rücknahme Koa-Reform: Handwerkerbonus bei 20% belassen","https://www.haufe.de/steuern/gesetzgebung-politik/koalition-einigt-sich-auf-steuerentlastungen_168_690706.html"],["KOAAKR7","einnahmen",0.9,"Rücknahme Koa-Reform: Aktivrente (2.000 € steuerfrei) abschaffen","https://amp.infranken.de/ratgeber/karriere-geld/rente-aktivrente-verlust-reform-milliarden-euro-gesetz-januar-2026-steuern-selbststaendige-art-6265212"],["KTFRUE7","einnahmen",-2.7,"Rücknahme KTF-Plünderung: Emissionshandels-Erlöse wieder in KTF statt in Kernhaushalt","https://www.zdfheute.de/politik/deutschland/haushalt-finanzplan-regierungsentwurf-kabinett-100.html"],["CO2STP7","einnahmen",-4,"CO2-Preis-Stopp 2027 durchsetzen (BEHG-Änderung Ende Juli, noch nicht beschlossen)","https://www.t-online.de/finanzen/energie/id_101342610/erhoehung-der-co2-steuer-2027-gestoppt-milliarden-gehen-regierung-verloren.html"],["NSTDGT7","einnahmen",6,"Digitalsteuer 10% auf US-Digitalkonzerne (Frankreich-Vorbild)","https://www.netzwerk-steuergerechtigkeit.de/jahrbuch/"],["NSTUGW7","einnahmen",19,"Digitalsteuer erweitern — Übergewinnsteuer 50% auf 200 profitabelste Konzerne (Netzwerk Steuergerechtigkeit)","https://www.netzwerk-steuergerechtigkeit.de/jahrbuch/"],["NSTKRY7","einnahmen",7,"Kryptowährungen an die Besteuerung von Aktien angleichen (Ein-Jahres-Haltefrist abschaffen)","https://www.netzwerk-steuergerechtigkeit.de/jahrbuch/"],["NSTSUV7","einnahmen",11,"SUV/Luxus-Kfz-Erwerbsteuer nach dänischem Vorbild (~40.000 € einmalig)","https://www.netzwerk-steuergerechtigkeit.de/jahrbuch/"],["NSTMFS7","einnahmen",7,"Ermäßigten MwSt-Satz (7%) für Fleisch und Süßigkeiten streichen (Netzwerk Steuergerechtigkeit)","https://www.netzwerk-steuergerechtigkeit.de/jahrbuch/"],["FUESTMW","einnahmen",36,"Ermäßigten MwSt-Satz komplett abschaffen — 19% auf alles (Fuest/ifo, inkl. Sozialgutscheine)","https://www.zeit.de/politik/ausland/2026-08/mehrwertsteuer-lebensmittel-clemens-fuest-ifo-institut-gxe"],["9TZQ889","einnahmen",-0.7,"MwSt für pflanzliche Alternativprodukte auf 7% reduzieren (Hafer-/Sojadrinks, vegane Fleischersatzprodukte)","https://www.foodwatch.org/de/pressemitteilungen/2023/hafermilch-teurer-als-kuhmilch-foodwatch-fordert-abschaffung-der-diskriminierenden-mehrwertsteuer-auf-pflanzliche-produkte"],["H775TQO","einnahmen",-9.3,"Zusätzlich: MwSt auf alle pflanzlichen Grundnahrungsmittel auf 0 % (statt 7 %)","https://www.bund.net/service/publikationen/detail/publication/plaedoyer-fuer-eine-tierwohl-und-umweltvertraegliche-agrarwende/"],["SOLIABG","einnahmen",-13,"Solidaritätszuschlag vollständig abschaffen (AfD-Antrag 21/5763)","https://dserver.bundestag.de/btd/21/057/2105763.pdf"],["MWSTGB7","einnahmen",-16,"MwSt auf Grundnahrungsmittel, Hygieneprodukte, Bus & Bahn auf 0% (Die Linke)","https://dserver.bundestag.de/btd/21/001/2100135.pdf"],["STROMEU","einnahmen",-4,"Stromsteuer für alle Verbraucher auf EU-Mindestmaß absenken (statt nur produzierendes Gewerbe)","https://www.bundestag.de/dokumente/textarchiv/2025/kw41-de-energiesteuergesetz-1111808"],["CANNAB7","einnahmen",1.5,"Cannabis-Vollegalisierung: staatlich regulierter Einzelhandel (2. Säule des CanG)","https://www.wirtschaftsdienst.eu/inhalt/jahr/2024/heft/2/beitrag/die-legalisierung-von-cannabis-in-deutschland.html"]];
const AREAS={soziales:["Soziales & Rente","Social & pensions","armchair"],verteidigung:["Verteidigung","Defence","shield-half"],finanzverwaltung:["Allgemeine Finanzverwaltung","General finance","banknote"],
  zinsen:["Zinsen & Schulden","Interest & debt","coins"],verkehr:["Verkehr & Infrastruktur","Transport & infrastructure","train-front"],gesundheit:["Gesundheit","Health","stethoscope"],
  bildung:["Bildung, Forschung & Familie","Education, research & family","graduation-cap"],inneres:["Inneres & Sicherheit","Interior & security","shield"],
  entwicklung:["Entwicklungshilfe & Diplomatie","Development & diplomacy","globe"],wohnen:["Wohnen & Landwirtschaft","Housing & agriculture","house"],
  verwaltung:["Allgemeine Verwaltung","Public administration","landmark"],sonstige_ressorts:["Wirtschaft & Umwelt","Economy & environment","factory"],
  sv_ktf:["Klima- & Transformationsfonds","Climate & transformation fund","wind"],einnahmen:["Steuern & Einnahmen","Taxes & revenue","receipt"]};
const HL_TAG={rev:{de:"Mehreinnahmen pro Jahr",en:"Extra revenue per year"},cut:{de:"Steuersenkung pro Jahr",en:"Tax cut per year"},save:{de:"Einsparung pro Jahr",en:"Saving per year"},spend:{de:"Mehrausgaben pro Jahr",en:"Extra spending per year"}};
HL.forEach(([code,area,d,text,src])=>{
  const rev=area==="einnahmen", kind=(rev?d>0:d<0)?"gain":"loss", tag=rev?(d>0?"rev":"cut"):(d<0?"save":"spend");
  const ar=AREAS[area]||[area,area,"receipt"], title=text.replace(/^Zusätzlich:\s*/,""), extra=/^Zusätzlich:/.test(text);
  let host=""; try{ host=new URL(src).hostname.replace(/^www\./,""); }catch(e){}
  ITEMS.push({ id:"hl-"+code, hl:1, src, area, icon:"l-"+ar[2], kind, group:"hl", annual:1, tag:HL_TAG[tag],
    title:{de:title,en:title}, short:{de:ar[0],en:ar[1]},
    who:{de:host?`Quelle: ${host}`:"",en:host?`Source: ${host}`:""},
    context:{de:`Vorschlag aus dem Bereich „${ar[0]}“ für den Bundeshaushalt 2027. Geschätzte Wirkung: ${Math.abs(d).toLocaleString("de-DE")} Mrd. € pro Jahr${tag==="save"||tag==="rev"?" weniger Defizit":" mehr Defizit"}.${extra?" Der Vorschlag baut auf einem anderen Vorschlag auf.":""}`,
             en:`Proposal from the “${ar[1]}” area for the 2027 federal budget. Estimated effect: €${Math.abs(d).toLocaleString("en-GB")} bn a year ${tag==="save"||tag==="rev"?"less":"more"} deficit.${extra?" It builds on another proposal.":""}`},
    caveat:{de:"Die Zahl ist hier nicht nachgeprüft. Begründung und Gegenargumente stehen in der verlinkten Quelle.",
            en:"The figure has not been checked here. Reasons and counter-arguments are in the linked source."},
    scen:{mid:[Math.abs(d)*1e9,{de:"Schätzung für den Bundeshaushalt 2027.",en:"Estimate for the 2027 federal budget."}]} });
});

const U = (e,de,en,p,o={}) => ({e,n:{de,en},p,...o});
// Deutschlandticket 2026: €63 fare; Bund and Länder each add €1.5 bn a year; about 14.6 m users (VDV) → ~€8.56 + €8.56 per ticket and month.
const DT={fare:63, bund:1.5e9, laender:1.5e9, subs:14.6e6};
DT.bundM=DT.bund/12/DT.subs; DT.laenderM=DT.laender/12/DT.subs; DT.full=DT.fare+DT.bundM+DT.laenderM;
const dtSplit=L=>L==="de"
  ? `${eur(DT.full)}/Monat = ${eur(DT.fare)} Fahrgast + ${eur(DT.bundM)} Bund + ${eur(DT.laenderM)} Länder`
  : `${eur(DT.full)}/month = ${eur(DT.fare)} passenger + ${eur(DT.bundM)} federal + ${eur(DT.laenderM)} states`;
const W = (de,en) => ({de,en});
// Each slide has a pool spanning many orders of magnitude; per amount the slide shows one unit per range (see shownIdx).
const YR={y:1,ny:1,w:W("Jahre","years")};
const UNITS = {
  every:[U("sandwich","Döner","Döner kebab",8),U("cup-soda","McDonald's-Menü","McDonald's meal",10),U("utensils","Mensa-Essen","Uni canteen meal",4),
         U("beer","Bier im Stadion","Stadium beer",5.5),U("coffee","Kaffee & Kuchen","Coffee and cake",8),U("ice-cream-cone","Kugel Eis","Scoop of ice cream",2),U("clapperboard","Kinoticket","Cinema ticket",13),U("utensils-crossed","Essen gehen zu zweit","Dinner out for two",80),
         U("croissant","Brötchen","Bread roll",0.45),U("headphones","Musik-Streaming-Abo","Music streaming plan",11.99,{w:W("Abo-Monate","subscription months"),prTxt:L=>L==="de"?"11,99 € pro Monat":"€11.99 per month"}),
         U("sandwich","Ein Döner für alle in Köln","A Döner for everyone in Cologne",1.08e6*8),U("utensils","Ein Mensa-Essen für alle Studierenden","A canteen meal for every student",2.87e6*4),
         U("ice-cream-cone","Eine Kugel Eis für ganz Deutschland","A scoop of ice cream for all of Germany",83.6e6*2),U("clapperboard","Ein Kinoabend für ganz Deutschland","A cinema night for all of Germany",83.6e6*13),
         U("sandwich","Ein Döner für alle in der EU","A Döner for everyone in the EU",450e6*8),U("coffee","Ein Jahr täglich Kaffee & Kuchen für Berlin","Coffee and cake daily for Berlin, one year",3.9e6*8*365),
         U("croissant","Ein Jahr täglich zwei Brötchen für ganz Deutschland","Two rolls a day for all of Germany, one year",83.6e6*2*0.45*365),U("beer","Ein Bier für alle Menschen der Welt","A beer for everyone on Earth",8.1e9*5.5),
         U("sandwich","Ein Jahr täglich Döner für ganz Deutschland","A daily Döner for all of Germany, one year",83.6e6*8*365),
         U("coffee","Kaffee & Kuchen für ein ganzes Dorf (1.000 Leute)","Coffee and cake for a whole village (1,000 people)",1000*8),
         U("ice-cream-cone","Eis für ein volles Freibad (5.000 Gäste)","Ice cream for a full open-air pool (5,000 guests)",5000*2),
         U("sandwich","Ein Döner für ein ausverkauftes Stadion (75.000)","A Döner for a sold-out stadium (75,000)",75000*8),
         U("chef-hat","Menü im Sternerestaurant (pro Person)","Tasting menu at a Michelin-star restaurant (per person)",250),
         U("wine","Flasche Champagner","Bottle of champagne",60)],
  month:[U("ticket","Deutschlandticket","Deutschlandticket",DT.fare,{m:1,w:W("Personen","people"),prTxt:L=>L==="de"?`${eur(DT.fare)}/Monat Fahrgastpreis, ohne Zuschuss`:`${eur(DT.fare)}/month fare, without subsidy`}),
         U("ticket","Deutschlandticket inkl. Zuschuss","Deutschlandticket incl. subsidy",DT.full,{m:1,w:W("Personen","people"),prTxt:dtSplit}),U("bed-double","WG-Zimmer","Shared-flat room",510,{cost:()=>WGP[PROFILE.city]||510,m:1,w:W("Studierende","students")}),
         U("building","Miete, 70 m²","Rent, 70 m²",780,{cost:()=>RENT[PROFILE.city]||780,m:1,w:W("Haushalte","households")}),U("graduation-cap","BAföG-Höchstsatz","Max. student grant (BAföG)",992,{m:1,w:W("Studierende","students")}),
         U("baby","Kindergeld","Child benefit",255,{m:1,ny:1,w:W("Kinder ein Jahr lang Kindergeld","children get child benefit for a year")}),U("armchair","Ø Altersrente (1.250 €/Monat)","Average pension (€1,250/month)",1250,{m:1,ny:1,w:W("Renten 1 Jahr auszahlen","pensions paid for 1 year")}),
         U("heart-handshake","Eigenanteil Pflegeheim","Care-home own share",3000,{m:1,w:W("Bewohner:innen","residents")}),U("briefcase","Ø Nettogehalt Vollzeit","Avg. full-time net pay",2900,{m:1,w:W("Beschäftigte","workers")}),U("baby","Kita-Beitrag (200 €/Monat)","Daycare fee (€200/month)",200,{m:1,ny:1,w:W("Kita-Beiträge für ein Jahr","daycare fees for a year")}),
         U("radio","Rundfunkbeitrag","TV licence fee",18.36,{m:1,w:W("Haushalte","households")}),U("smartphone","Handyvertrag","Mobile contract",20,{m:1,w:W("Personen","people")}),
         U("building","Miete aller Berliner Haushalte, 1 Monat","Rent of all Berlin households, 1 month",2e6*800),U("graduation-cap","BAföG insgesamt (rund 3 Mrd. €/Jahr)","All BAföG (about €3 bn/yr)",3e9,YR),
         U("ticket","Deutschlandticket für alle Schüler:innen","Deutschlandticket for every pupil",8.4e6*DT.fare*12,YR),U("users","Bürgergeld insgesamt (rund 47 Mrd. €/Jahr)","All Bürgergeld (about €47 bn/yr)",47e9,YR),
         U("baby","Kindergeld für alle Kinder (rund 55 Mrd. €/Jahr)","Child benefit for all children (about €55 bn/yr)",55.3e9,YR),U("armchair","Alle gesetzlichen Renten (rund 420 Mrd. €/Jahr)","All statutory pensions (about €420 bn/yr)",420e9,YR),
         U("ticket","Deutschlandticket für ganz Göttingen, 1 Jahr","Deutschlandticket for all of Göttingen, 1 year",118e3*DT.fare*12),
         U("building","Miete aller Haushalte in Freiburg, 1 Jahr","Rent of all households in Freiburg, 1 year",125e3*800*12),
         U("flag","Golfclub-Mitgliedschaft","Golf club membership",250,{m:1,w:W("Mitglieder","members")})],
  buy:[U("smartphone","iPhone","iPhone",1000),U("tent","Festivalticket","Festival ticket",300),U("trophy","Bundesliga-Dauerkarte","Bundesliga season ticket",300),
       U("ship","Kreuzfahrt","Cruise",3000),U("car","Neuer VW Golf","New VW Golf",32000),
       U("sun","Solaranlage aufs Dach","Rooftop solar",15000),U("house","Reihenhaus","Terraced house",400000),U("graduation-cap","Semesterbeitrag","Semester fee",330),U("flame","Heizkosten für ein Jahr","Heating bill for a year",1300),U("luggage","Pauschalreise Mallorca, Familie","Mallorca package holiday, family",3500),
       U("footprints","Paar Sneaker","Pair of sneakers",100),U("tv","Fernseher","TV set",600),
       U("smartphone","Ein iPhone für alle Schüler:innen","An iPhone for every pupil",8.4e6*1000),U("house","Reihenhäuser für ganz Göttingen","Terraced houses for all of Göttingen",118e3/2.5*400000),
       U("heater","Wärmepumpen für 1 Mio. Häuser","Heat pumps for 1 m homes",1e6*30000),U("sun","Solar aufs Dach aller 16 Mio. Einfamilienhäuser","Solar on all 16 m detached homes",16e6*15000),
       U("tent","Festivaltickets für alle Fans von Rock am Ring (90.000)","Festival tickets for every Rock am Ring fan (90,000)",90000*300),
       U("house","Neubausiedlung mit 100 Reihenhäusern","New estate of 100 terraced houses",100*400000),
       U("tv","Ein Fernseher für jeden Haushalt in Köln","A TV for every household in Cologne",550e3*600),
       U("watch","Rolex Submariner","Rolex Submariner",10500),U("plane-landing","Business Class nach New York und zurück","Business class to New York and back",4500),
       U("castle","Villa am Starnberger See","Villa on Lake Starnberg",6e6)],
  car:[U("fuel","Liter Super E10","Litre of petrol",0,{cost:()=>A.price}),U("zap","E-Auto volladen (60 kWh, zu Hause)","Full EV charge (60 kWh, at home)",0,{cost:()=>60*A.power}),
       U("car-taxi-front","Taxifahrt, 10 km","Taxi ride, 10 km",30),U("train-front","ICE Berlin–München (Flexpreis)","ICE Berlin–Munich (flex fare)",150),
       U("plane","Flug nach Mallorca und zurück","Return flight to Mallorca",200),U("bike","Neues Fahrrad","New bicycle",900),
       U("plug-zap","Schnellladesäule","Fast-charging station",100000),U("route","Kilometer Autobahn (Neubau)","Km of new motorway",20e6),
       U("shield-check","Kfz-Versicherung für ein Jahr","Car insurance for a year",700,{per:"y"}),U("bus","Elektrobus","Electric bus",600000),
       U("circle-parking","Parkschein, 1 Stunde","Parking ticket, 1 hour",2.5),
       U("bus","E-Bus-Flotte für Berlin (1.500 Busse)","E-bus fleet for Berlin (1,500 buses)",1500*600000),
       U("bus","E-Bus-Flotte für eine Stadt (100 Busse)","E-bus fleet for a city (100 buses)",100*600000),
       U("fuel","Einmal volltanken, alle 49 Mio. Pkw","One full tank for all 49 m cars",0,{cost:()=>49e6*A.tank*A.price}),
       U("fuel","Ein Jahr Sprit für alle Pkw in Deutschland","A year of fuel for all cars in Germany",0,{cost:()=>49e6*12000*A.cons/100*A.price}),
       U("car","Porsche 911","Porsche 911",130000)],
  pub:[U("presentation","Lehrkraft","Teacher",0,{y:1,cost:()=>A.staffCost,w:W("Stellen","posts")}),U("stethoscope","Pflegekraft","Nurse",60000,{y:1,w:W("Stellen","posts")}),
       U("shield","Polizist:in","Police officer",67400,{y:1,w:W("Stellen","posts")}),U("blocks","Krippenplatz (unter 3)","Nursery place (under 3)",15800,{y:1,w:W("Kinder","children")}),
       U("building-2","Sozialwohnung (Neubau)","New social housing flat",300000),U("bike","Kilometer Radweg","Km of cycle path",1e6),
       U("hammer","Kita-Neubau","New daycare centre",5e6),U("waves","Hallenbad","Indoor pool",25e6),U("train-front","ICE-Zug","ICE train",35e6),
       U("siren","Löschfahrzeug der Feuerwehr","Fire engine",500000),
       U("book-open","Schulbuch","School book",25),U("laptop","Laptop für Schüler:innen","Laptop for a pupil",500),
       U("school","Neubau einer Schule","New school building",0,{cost:()=>A.schoolBuild*1e6}),
       U("users","Kollegium einer Schule","A school's whole staff",0,{y:1,w:W("Schulen","schools"),cost:()=>A.staff*A.staffCost}),
       U("wifi","Digitalpakt Schule (rund 6,5 Mrd. €)","School digital pact (about €6.5 bn)",6.5e9),U("wrench","Sanierungsstau an Schulen (rund 55 Mrd. €)","School repair backlog (about €55 bn)",55e9),
       U("presentation","Alle Lehrkräfte Deutschlands, 1 Jahr","All teachers in Germany, 1 year",0,{cost:()=>800e3*A.staffCost}),
       U("presentation","Alle Lehrkräfte einer Großstadt (10.000), 1 Jahr","All teachers of a big city (10,000), 1 year",0,{cost:()=>10000*A.staffCost})],
  big:[U("plane","Eurofighter","Eurofighter jet",120e6),U("goal","Allianz Arena (Bau)","Allianz Arena (build)",340e6),U("hospital","Krankenhaus-Neubau","New hospital",400e6),
       U("music","Elbphilharmonie","Elbphilharmonie",866e6),U("plane-takeoff","Flughafen BER","BER airport",7e9),U("train-track","Stuttgart 21","Stuttgart 21",11.5e9),U("shield","Kampfpanzer Leopard 2A8","Leopard 2A8 tank",29e6),U("anchor","Fregatte F126","F126 frigate",1.5e9),
       U("shield-half","Sondervermögen Bundeswehr","Bundeswehr special fund",100e9),
       U("ticket","Zuschuss Deutschlandticket (Bund + Länder)","Deutschlandticket subsidy (federal + states)",DT.bund+DT.laender,{y:1,ny:1,w:W("Jahre","years"),prTxt:L=>L==="de"?`${eur(DT.bund)} Bund + ${eur(DT.laender)} Länder pro Jahr`:`${eur(DT.bund)} federal + ${eur(DT.laender)} states per year`}),
       U("wind","Windrad an Land (5 MW)","Onshore wind turbine (5 MW)",7e6),U("construction","Sondervermögen Infrastruktur","Infrastructure special fund",500e9),
       U("landmark","Bundeshaushalt 2026","Federal budget 2026",524.5e9),
       U("goal","Ein Sitzplatz der Allianz Arena (340 Mio. € ÷ 75.000)","One Allianz Arena seat (€340 m ÷ 75,000)",340e6/75000),
       U("music","Ein m² Elbphilharmonie (866 Mio. € ÷ 125.500 m²)","One m² of Elbphilharmonie (€866 m ÷ 125,500 m²)",866e6/125500),
       U("plane","Eine Flugstunde Eurofighter (rund 74.000 €)","One Eurofighter flight hour (about €74,000)",74000),
       U("train-track","Ein Meter Tunnel Stuttgart 21 (rund 59 km)","One metre of Stuttgart 21 tunnel (about 59 km)",11.5e9/59000),
       U("plane-takeoff","Ein Tag Bauzeit BER (14 Jahre)","One day of BER construction (14 years)",7e9/(14*365))],
  life:[U("clock","Stunden Arbeit zum Mindestlohn","Hours of work at minimum wage",13.9,{w:W("Stunden","hours")}),
        U("briefcase","Arbeitsjahre (Ø netto, Vollzeit)","Working years (avg. net, full-time)",34800,{w:W("Arbeitsjahre","working years")}),
        U("hard-hat","Arbeitsleben (Ø netto)","Working lives (avg. net)",1.5e6,{w:W("ganze Arbeitsleben","whole working lives")}),
        U("timer","Arbeitsstunden zum Ø-Nettolohn","Working hours at avg. net pay",16.76,{w:W("Stunden","hours")}),
        U("receipt","Steuerjahre bei 50.000 € brutto (grob)","Tax years at €50k gross (rough)",9250,{w:W("Steuerjahre","tax years")}),
        U("shopping-cart","Ein Leben lang einkaufen (1 Person)","A lifetime of groceries (1 person)",0,{w:W("Leben","lifetimes"),cost:()=>A.grocery/(HH[PROFILE.home]||HH.kids)[1]*12*81}),
        U("piggy-bank","Medianvermögen eines Haushalts","Median household wealth",103200,{w:W("Haushalte","households")}),
        U("coins","Sekunden Steuereinnahmen Deutschlands","Seconds of German tax revenue",991e9/31557600,{w:W("Sekunden","seconds")}),
        U("factory","Minuten Wirtschaftsleistung Deutschlands","Minutes of German GDP",4.4e12/525960,{w:W("Minuten","minutes")}),
        U("hourglass","Stunden Bundeshaushalt","Hours of the federal budget",524.5e9/8766,{w:W("Stunden","hours")}),
        U("calendar-days","Tage Bundeshaushalt","Days of the federal budget",524.5e9/365.25,{w:W("Tage","days")}),
        U("factory","Wochen Wirtschaftsleistung Deutschlands","Weeks of German GDP",4.4e12/52.18,{w:W("Wochen","weeks")}),
        U("users","1 € für jede:n in Deutschland","€1 for everyone in Germany",83.6e6),
        U("users","100 € für jede:n in Deutschland","€100 for everyone in Germany",83.6e6*100),
        U("coins","Steuereinnahmen eines ganzen Jahres","A whole year of tax revenue",991e9)]
};
const TAGS={
  "Döner":["school","student","work"],"McDonald's-Menü":["school","student"],"Mensa-Essen":["student"],"Bier im Stadion":["football"],"Kaffee & Kuchen":["retired"],
  "Kugel Eis":["kids"],"Kinoticket":["school","student","partner"],"Essen gehen zu zweit":["eatout","partner"],
  "Deutschlandticket":["transit","student","school"],"Brötchen":["school","retired"],"Rundfunkbeitrag":["alone","partner","kids","rent","own"],"Handyvertrag":["school","student","work"],"Paar Sneaker":["school","student"],"Fernseher":["football","partner"],
  "Parkschein, 1 Stunde":["car","big"],"Schulbuch":["kids","school"],"Laptop für Schüler:innen":["kids","school","student"],"Neubau einer Schule":["kids"],"Kollegium einer Schule":["kids","school"],"Windrad an Land (5 MW)":["rural"],
  "Ein Döner für alle in Köln":["big"],"Ein Mensa-Essen für alle Studierenden":["student"],"Deutschlandticket für alle Schüler:innen":["school","transit","kids"],"Kindergeld für alle Kinder (rund 55 Mrd. €/Jahr)":["kids"],
  "Alle gesetzlichen Renten (rund 420 Mrd. €/Jahr)":["retired","work"],"Ein iPhone für alle Schüler:innen":["school"],"Einmal volltanken, alle 49 Mio. Pkw":["car"],"Ein Jahr Sprit für alle Pkw in Deutschland":["car"],
  "E-Bus-Flotte für Berlin (1.500 Busse)":["transit","big"],"Sanierungsstau an Schulen (rund 55 Mrd. €)":["kids","school"],"Kfz-Versicherung für ein Jahr":["car"],"Elektrobus":["transit","big"],"Löschfahrzeug der Feuerwehr":["rural","town"],"Arbeitsstunden zum Ø-Nettolohn":["work"],"Steuerjahre bei 50.000 € brutto (grob)":["work"],"Medianvermögen eines Haushalts":["own","partner","kids"],"Ein Leben lang einkaufen (1 Person)":["alone"],"Deutschlandticket inkl. Zuschuss":["transit","student","school","big"],"Zuschuss Deutschlandticket (Bund + Länder)":["transit"],"WG-Zimmer":["student","wg"],"Miete, 70 m²":["rent"],"BAföG-Höchstsatz":["student"],"Kindergeld":["kids"],
  "Ø Altersrente (1.250 €/Monat)":["retired"],"Eigenanteil Pflegeheim":["retired"],"Ø Nettogehalt Vollzeit":["work"],"Musik-Streaming-Abo":["school","student","festival"],"Kita-Beitrag (200 €/Monat)":["kids"],
  "iPhone":["school","student","work"],"Festivalticket":["festival","student"],"Bundesliga-Dauerkarte":["football"],"Familienurlaub":["kids","travel"],"Kreuzfahrt":["retired","travel"],
  "Neuer VW Golf":["car"],"Wärmepumpe":["own"],"Solaranlage aufs Dach":["own"],"Reihenhaus":["own","kids","partner"],"Semesterbeitrag":["student"],
  "Heizkosten für ein Jahr":["rent","own"],"Pauschalreise Mallorca, Familie":["travel","kids"],
  "Liter Super E10":["car"],"E-Auto volladen (60 kWh, zu Hause)":["car","own"],"Taxifahrt, 10 km":["eatout"],"ICE Berlin–München (Flexpreis)":["transit","work"],
  "Flug nach Mallorca und zurück":["travel"],"Neues Fahrrad":["bike"],"Schnellladesäule":["car"],"Kilometer Autobahn (Neubau)":["car"],
  "Lehrkraft":["kids","school"],"Pflegekraft":["retired"],"Krippenplatz (unter 3)":["kids"],"Sozialwohnung (Neubau)":["rent","wg"],"Kilometer Radweg":["bike"],"Kita-Neubau":["kids"],
  "Hallenbad":["kids"],"ICE-Zug":["transit"],"Allianz Arena (Bau)":["football"],"Krankenhaus-Neubau":["retired"],"Flughafen BER":["travel"],"Stuttgart 21":["transit"],
  "Stunden Arbeit zum Mindestlohn":["school","student","work"],"Arbeitsjahre (Ø netto, Vollzeit)":["work"],"Arbeitsleben (Ø netto)":["work"]
};
Object.values(UNITS).flat().forEach(u=>u.tags=TAGS[u.n.de]||[]);
const EXTRA={"Döner":["alone","big"],"McDonald's-Menü":["alone"],"Musik-Streaming-Abo":["alone"],"Miete, 70 m²":["alone","partner","big"],"Taxifahrt, 10 km":["big","alone"],
  "Kreuzfahrt":["partner"],"Flug nach Mallorca und zurück":["partner","alone"],"Deutschlandticket":["big"],"WG-Zimmer":["big"],"Kilometer Radweg":["big"],
  "Neuer VW Golf":["rural","town"],"Liter Super E10":["rural"],"Kilometer Autobahn (Neubau)":["rural"],"Reihenhaus":["town","rural"],"Solaranlage aufs Dach":["rural"],
  "Wärmepumpe":["rural"],"Hallenbad":["town"],"Kita-Neubau":["town"],"Elbphilharmonie":["festival","big"],"Polizist:in":["big"],"Krankenhaus-Neubau":["rural"],
  "Schnellladesäule":["rural"],"Sozialwohnung (Neubau)":["big"],
  "Scheuers Pkw-Maut":["car"],"Dienstwagenprivileg":["car","work"],"7 % Mehrwertsteuer fürs Restaurant":["eatout"],"Mütterrente III":["kids","retired"],
  "Vermögensteuer einführen":["own"],"Rente mit 70":["work","retired"],"Pendlerpauschale abschaffen":["car","work","rural"],"Ehegattensplitting abschaffen":["partner","kids"],"Kerosinsteuer einführen":["travel"],"Spitzensteuersatz auf 53 %":["i5"],"Finanztransaktionssteuer":["i4","i5"],"Einen Feiertag streichen":["work"],"Erbschaftsteuer durchsetzen":["own","kids"],"Steuerhinterziehung eintreiben":["work"]};
Object.assign(EXTRA,{
  "Menü im Sternerestaurant (pro Person)":["i4","i5","eatout"],"Flasche Champagner":["i4","i5","partner"],"Golfclub-Mitgliedschaft":["i5","retired"],
  "Rolex Submariner":["i5"],"Business Class nach New York und zurück":["i4","i5","travel"],"Villa am Starnberger See":["i5","own"],"Porsche 911":["i5","car"],
  "Kreuzfahrt":["i3","i4"],"Essen gehen zu zweit":["i3","i4"],"Solaranlage aufs Dach":["i3","i4"],"Reihenhaus":["i3","i4"],
  "Döner":["i1","i2"],"Mensa-Essen":["i1"],"Brötchen":["i1","i2"],"Deutschlandticket":["i1","i2"],"Sozialwohnung (Neubau)":["i1"],"Handyvertrag":["i1","i2"],"Paar Sneaker":["i1","i2"],"McDonald's-Menü":["i1","i2"]});
Object.entries(EXTRA).forEach(([k,v])=>TAGS[k]=[...(TAGS[k]||[]),...v]);
Object.values(UNITS).flat().forEach(u=>u.tags=TAGS[u.n.de]||[]);
// Clear mismatches push a tile back (−4 each, enough to outweigh one strong match).
const NEG={"Döner":["i5"],"McDonald's-Menü":["i4","i5"],"Mensa-Essen":["i4","i5"],"Sozialwohnung (Neubau)":["i4","i5"],
  "Menü im Sternerestaurant (pro Person)":["i1","i2"],"Flasche Champagner":["i1"],"Golfclub-Mitgliedschaft":["i1","i2","student","school"],"Rolex Submariner":["i1","i2","i3","student","school"],
  "Business Class nach New York und zurück":["i1","i2"],"Villa am Starnberger See":["i1","i2","i3"],"Porsche 911":["i1","i2","bike","transit"],"BAföG-Höchstsatz":["retired","work"],"Semesterbeitrag":["retired","work"],"Mensa-Essen":["retired"],"WG-Zimmer":["retired","kids","own"],
  "Ø Altersrente (1.250 €/Monat)":["school","student"],"Eigenanteil Pflegeheim":["school","student"],"Festivalticket":["retired"],"Kita-Beitrag (200 €/Monat)":["school","retired"],"Kindergeld":["retired"],
  "Liter Super E10":["bike"],"Neuer VW Golf":["bike"],"Wärmepumpe":["rent"],"Solaranlage aufs Dach":["rent"],"Reihenhaus":["wg"]};
// Group tiles ("a round for all of Köln") lead with the individual count and name the group as "…: N-mal".
// [items per group, item word DE, EN, group phrase DE, EN]
const GROUPS={
  "Ein Döner für alle in Köln":[1.08e6,"Döner","Döner","eine Runde für alle in Köln","a round for everyone in Cologne"],
  "Ein Mensa-Essen für alle Studierenden":[2.87e6,"Mensa-Essen","canteen meals","eine Runde für alle Studierenden","a round for every student"],
  "Eine Kugel Eis für ganz Deutschland":[83.6e6,"Kugeln Eis","scoops of ice cream","eine Runde für ganz Deutschland","a round for all of Germany"],
  "Ein Kinoabend für ganz Deutschland":[83.6e6,"Kinotickets","cinema tickets","ein Kinoabend für ganz Deutschland","a night at the movies for all of Germany"],
  "Ein Döner für alle in der EU":[450e6,"Döner","Döner","eine Runde für alle in der EU","a round for everyone in the EU"],
  "Ein Jahr täglich Kaffee & Kuchen für Berlin":[3.9e6*365,"Kaffee & Kuchen","coffee and cake","ein Jahr lang täglich für ganz Berlin","daily for all of Berlin for a year"],
  "Ein Jahr täglich zwei Brötchen für ganz Deutschland":[83.6e6*2*365,"Brötchen","bread rolls","ein Jahr lang täglich zwei für ganz Deutschland","two a day for all of Germany for a year"],
  "Ein Bier für alle Menschen der Welt":[8.1e9,"Bier","beers","eine Runde für die ganze Welt","a round for the whole world"],
  "Ein Jahr täglich Döner für ganz Deutschland":[83.6e6*365,"Döner","Döner","ein Jahr lang täglich für ganz Deutschland","daily for all of Germany for a year"],
  "Kaffee & Kuchen für ein ganzes Dorf (1.000 Leute)":[1000,"Kaffee & Kuchen","coffee and cake","eine Runde für ein Dorf mit 1.000 Leuten","a round for a village of 1,000"],
  "Eis für ein volles Freibad (5.000 Gäste)":[5000,"Kugeln Eis","scoops of ice cream","eine Runde für ein volles Freibad","a round for a full open-air pool"],
  "Ein Döner für ein ausverkauftes Stadion (75.000)":[75000,"Döner","Döner","eine Runde fürs ausverkaufte Stadion","a round for a sold-out stadium"],
  "Miete aller Berliner Haushalte, 1 Monat":[2e6,"Mieten","rents","alle Berliner Haushalte, einen Monat","every Berlin household, one month"],
  "Deutschlandticket für alle Schüler:innen":[8.4e6*12,"Monats-Deutschlandtickets","monthly Deutschlandtickets","ein Jahr für alle Schüler:innen","a year for every pupil"],
  "Deutschlandticket für ganz Göttingen, 1 Jahr":[118e3*12,"Monats-Deutschlandtickets","monthly Deutschlandtickets","ein Jahr für ganz Göttingen","a year for all of Göttingen"],
  "Miete aller Haushalte in Freiburg, 1 Jahr":[125e3*12,"Monatsmieten","monthly rents","alle Haushalte in Freiburg, ein Jahr","every household in Freiburg, one year"],
  "Ein iPhone für alle Schüler:innen":[8.4e6,"iPhones","iPhones","eins für alle Schüler:innen","one for every pupil"],
  "Reihenhäuser für ganz Göttingen":[118e3/2.5,"Reihenhäuser","terraced houses","eine Siedlung für ganz Göttingen","an estate for all of Göttingen"],
  "Wärmepumpen für 1 Mio. Häuser":[1e6,"Wärmepumpen","heat pumps","eine Million Häuser umrüsten","refit a million homes"],
  "Solar aufs Dach aller 16 Mio. Einfamilienhäuser":[16e6,"Solaranlagen","solar systems","auf alle Einfamilienhäuser","on every detached home"],
  "Festivaltickets für alle Fans von Rock am Ring (90.000)":[90000,"Festivaltickets","festival tickets","einmal Rock am Ring ausverkauft","Rock am Ring sold out"],
  "Neubausiedlung mit 100 Reihenhäusern":[100,"Reihenhäuser","terraced houses","Neubausiedlungen (je 100 Stück)","new estates (100 each)"],
  "Ein Fernseher für jeden Haushalt in Köln":[550e3,"Fernseher","TV sets","einer für jeden Haushalt in Köln","one for every household in Cologne"],
  "E-Bus-Flotte für Berlin (1.500 Busse)":[1500,"E-Busse","electric buses","die ganze Berliner Flotte","Berlin's whole fleet"],
  "E-Bus-Flotte für eine Stadt (100 Busse)":[100,"E-Busse","electric buses","Stadtflotten (je 100 Stück)","city fleets (100 each)"],
  "Einmal volltanken, alle 49 Mio. Pkw":[49e6,"Tankfüllungen","full tanks","einmal für alle Pkw in Deutschland","once for every car in Germany"],
  "Alle Lehrkräfte einer Großstadt (10.000), 1 Jahr":[10000,"Jahresgehälter","annual salaries","alle Lehrkräfte einer Großstadt","all teachers of a big city"],
  "Alle Lehrkräfte Deutschlands, 1 Jahr":[800e3,"Jahresgehälter","annual salaries","alle Lehrkräfte Deutschlands","all teachers in Germany"]
};
Object.values(UNITS).flat().forEach(u=>{ const g=GROUPS[u.n.de]; if(g) u.g={n:g[0],item:W(g[1],g[2]),grp:W(g[3],g[4])}; });
const groupName=(u,c)=>`${u.g.grp[state.lang]}: ${c>=1 ? (state.lang==="de"?`${nf(c,c<10?1:0)}-mal`:`${nf(c,c<10?1:0)} times`) : `${nf(c*100,c<0.1?1:0)} %`}`;
const RENT={big:980,town:670,rural:605}, WGP={big:650,town:510,rural:400};
const HH={alone:[330,1],wg:[900,3],partner:[600,2],kids:[950,4]};          // grocery €/month, persons
const TAXSHARE={i1:900,i2:4040,i3:9250,i4:19070,i5:50600}, TOTAL_TAX=991e9; // rough income tax + VAT per year (tax class I) vs. all tax revenue
const STATES=[["BW","Baden-Württemberg",11.28e6],["BY","Bayern",13.37e6],["BE","Berlin",3.78e6],["BB","Brandenburg",2.57e6],["HB","Bremen",0.68e6],["HH","Hamburg",1.89e6],
  ["HE","Hessen",6.39e6],["MV","Mecklenburg-Vorpommern",1.63e6],["NI","Niedersachsen",8.14e6],["NW","Nordrhein-Westfalen",18.14e6],["RP","Rheinland-Pfalz",4.16e6],
  ["SL","Saarland",0.99e6],["SN","Sachsen",4.09e6],["ST","Sachsen-Anhalt",2.19e6],["SH","Schleswig-Holstein",2.95e6],["TH","Thüringen",2.13e6]];
const NA=["na",W("Keine Angabe","Prefer not to say")];
const QS=[
  {id:"occ",one:1,w:3,q:W("Was machst du gerade?","What do you do?"),o:[["school",W("Schule / Ausbildung","School / training"),W("Schule","school")],["student",W("Studium","University"),W("Studium","uni")],["work",W("Beruf","Working"),W("Beruf","work")],["retired",W("Rente","Retired"),W("Rente","retired")],NA]},
  {id:"home",one:1,w:2,q:W("Mit wem lebst du?","Who do you live with?"),o:[["alone",W("Allein","Alone"),W("allein","alone")],["wg",W("In einer WG","Shared flat"),W("WG","shared flat")],["partner",W("Mit Partner:in","With a partner"),W("Partner:in","partner")],["kids",W("Mit Kindern","With children"),W("Kinder","children")],NA]},
  {id:"city",one:1,w:1,q:W("Wo wohnst du?","Where do you live?"),o:[["big",W("Großstadt","Big city"),W("Großstadt","city")],["town",W("Kleinstadt","Small town"),W("Kleinstadt","town")],["rural",W("Auf dem Land","Countryside"),W("Land","countryside")],NA],extra:"state"},
  {id:"move",one:1,w:2,q:W("Wie bist du meistens unterwegs?","How do you usually get around?"),o:[["car",W("Auto","Car"),W("Auto","car")],["transit",W("Bus & Bahn","Public transport"),W("Bahn","transit")],["bike",W("Rad oder zu Fuß","Bike or on foot"),W("Rad","bike")],NA],extra:"car"},
  {id:"house",one:1,w:2,q:W("Wie wohnst du?","How do you live?"),o:[["rent",W("Zur Miete","Renting"),W("Miete","renting")],["own",W("Im Eigentum","Own home"),W("Eigentum","own home")],NA]},
  {id:"income",one:1,w:3,q:W("Bruttojahreseinkommen (für „Dein Anteil“ und passende Vergleiche)","Gross annual income (for “Your share” and fitting comparisons)"),o:[["i1",W("unter 20.000 €","under €20k"),W("< 20k €","< €20k")],["i2",W("20–40.000 €","€20–40k"),W("20–40k €","€20–40k")],["i3",W("40–60.000 €","€40–60k"),W("40–60k €","€40–60k")],["i4",W("60–100.000 €","€60–100k"),W("60–100k €","€60–100k")],["i5",W("über 100.000 €","over €100k"),W("> 100k €","> €100k")],NA]},
  {id:"fun",one:0,w:1,q:W("Wofür gibst du gern Geld aus? (mehrere möglich)","What do you like to spend on? (pick any)"),o:[["football",W("Fußball","Football"),W("Fußball","football")],["festival",W("Konzerte & Festivals","Concerts & festivals"),W("Festivals","festivals")],["travel",W("Reisen","Travel"),W("Reisen","travel")],["eatout",W("Essen gehen","Eating out"),W("Essen gehen","eating out")],["none",W("Nichts davon","None of these")]]}
];
const TAGQ={}, TAGSHORT={}; QS.forEach(q=>q.o.forEach(([v,lab,sh])=>{ TAGQ[v]=q; TAGSHORT[v]=sh||lab; }));
let PROFILE={}; try{ PROFILE=JSON.parse(localStorage.getItem("steuerbeleg-profile")||"{}")||{}; }catch(e){ PROFILE={}; }
function profileTags(){ return new Set(QS.flatMap(q=>[].concat(PROFILE[q.id]||[])).filter(v=>v&&v!=="na"&&v!=="none")); }
function reasons(u){ const p=profileTags(); return (u.tags||[]).filter(x=>p.has(x)&&TAGQ[x]).sort((a,b)=>TAGQ[b].w-TAGQ[a].w); }
function score(u){ const p=profileTags(); return reasons(u).reduce((s,x)=>s+TAGQ[x].w,0) - 4*(NEG[u.n.de]||[]).filter(x=>p.has(x)).length; }
function saveProfile(){ try{ localStorage.setItem("steuerbeleg-profile",JSON.stringify(PROFILE)); }catch(e){} }
function answered(){ return QS.filter(q=>[].concat(PROFILE[q.id]||[]).length).length; }
// Assumptions the visitor typed in by hand win over questionnaire-derived values.
let A_EDIT={};
function applyProfile(){
  const hh=HH[PROFILE.home], car=PROFILE.move==="car";
  if(!A_EDIT.grocery) A.grocery = hh ? hh[0] : 950;
  if(!A_EDIT.cons) A.cons = car&&PROFILE.cons>0 ? PROFILE.cons : 7.5;
  if(!A_EDIT.tank) A.tank = car&&PROFILE.tank>0 ? PROFILE.tank : 50;
}
function myShare(amt){ const t0=TAXSHARE[PROFILE.income]; return t0 ? amt*t0/TOTAL_TAX : null; }
function renderProfile(){
  const L=state.lang, closed=PROFILE._closed && answered();
  $("qs").hidden=closed; $("prof-preview").hidden=closed||!profileTags().size; $("prof-done").hidden=closed||!answered();
  $("prof-sum").hidden=!closed;
  if(closed){
    const parts=QS.flatMap(q=>[].concat(PROFILE[q.id]||[]).filter(v=>v!=="na"&&v!=="none").map(v=>(q.o.find(o=>o[0]===v)||[])[1]?.[L])).filter(Boolean);
    const st=STATES.find(x=>x[0]===PROFILE.state); if(st) parts.splice(3,0,st[1]);
    $("prof-sum-txt").textContent=parts.join(" · ")||t("profNone");
  } else {
    $("qs").innerHTML=QS.map(q=>{
      const one=q.one, cur=[].concat(PROFILE[q.id]||[]);
      const opts=q.o.map(([v,lab])=>{ const on=cur.includes(v);
        return `<button type="button" class="qopt${v==="na"||v==="none"?" qna":""}" data-q="${q.id}" data-v="${v}" ${one?`role="radio" aria-checked="${on}"`:`aria-pressed="${on}"`}>${lab[L]}</button>`; }).join("");
      let extra="";
      if(q.extra==="state") extra=`<label class="qextra">${t("profState")} <select id="q-state"><option value="">–</option>${STATES.map(([c,n])=>`<option value="${c}"${PROFILE.state===c?" selected":""}>${n}</option>`).join("")}</select></label>`;
      if(q.extra==="car"&&PROFILE.move==="car") extra=`<div class="qextra"><label>${t("profCons")} <input type="number" id="q-cons" min="2" max="30" step="0.1" value="${PROFILE.cons||A.cons}"></label><label>${t("profTank")} <input type="number" id="q-tank" min="20" max="120" step="1" value="${PROFILE.tank||A.tank}"></label></div>`;
      return `<div class="q"><span class="ql" id="ql-${q.id}">${q.q[L]}</span><div class="qopts" role="${one?"radiogroup":"group"}" aria-labelledby="ql-${q.id}">${opts}</div>${extra}</div>`;
    }).join("");
    $("qs").querySelectorAll(".qopt").forEach(b=>b.onclick=()=>{
      const q=QS.find(x=>x.id===b.dataset.q), v=b.dataset.v, before=answered();
      if(q.one) PROFILE[q.id] = PROFILE[q.id]===v ? null : v;
      else if(v==="none") PROFILE[q.id] = (PROFILE[q.id]||[]).includes("none") ? [] : ["none"];
      else { const a=(PROFILE[q.id]||[]).filter(x=>x!=="none"); PROFILE[q.id]=a.includes(v)?a.filter(x=>x!==v):[...a,v]; }
      if(before<QS.length && answered()===QS.length) PROFILE._closed=true;  // collapse once, when the last question gets answered
      busy(()=>profileChanged(true));

    });
    const qs=$("q-state"); if(qs) qs.onchange=e=>{ PROFILE.state=e.target.value||null; profileChanged(false); };
    for(const [id,key] of [["q-cons","cons"],["q-tank","tank"]]){ const el=$(id); if(el) el.oninput=e=>{ const v=parseFloat(e.target.value); if(v>0){ PROFILE[key]=v; profileChanged(false); } }; }
  }
  // live preview: the best-matching everyday units for the current amount
  const amt=amount(), best=Object.entries(UNITS).filter(([k])=>k!=="topics").flatMap(([k,l])=>l).filter(u=>!u.time&&score(u)>0).sort((a,b)=>score(b)-score(a)).slice(0,4);
  $("prof-preview").innerHTML = best.length ? `<span class="pv-l">${t("profPreview")}</span>` + best.map(u=>`<span class="pv"><span class="ico l-${u.e}" aria-hidden="true"></span><b>${big(unitCount(u,amt))}</b> ${u.n[L]}</span>`).join("") : "";
  const n=Object.values(UNITS).flat().filter(u=>score(u)>0).length;
  $("prof-lede").textContent = profileTags().size ? t("profLede1")(n) : t("profLede0");
  $("prof-reset").hidden = !answered();
}
// full=true re-renders the questionnaire itself; false keeps focus in an input that is being typed into
function profileChanged(full){
  saveProfile(); applyProfile(); resetSel();
  if(full) renderStatic(); else { for(const k of ["grocery","cons","tank"]){ const el=$("a-"+k); if(el) el.value=A[k]; } }
  render();
  if(!full) renderProfile();
}
const PLACES=[[7.7e5,W("Frankfurt am Main","Frankfurt")],[1.08e6,W("Köln","Cologne")],[1.5e6,W("München","Munich")],[1.9e6,W("Hamburg","Hamburg")],[3.9e6,W("Berlin","Berlin")],
  [13.4e6,W("Bayern","Bavaria")],[18e6,W("NRW","North Rhine-Westphalia")],[83.6e6,W("Deutschland","Germany")],[450e6,W("der EU","the EU")],[8.1e9,W("der Welt","the world")]];
// When the selected topic is yearly, other yearly topics are counted over the same number of years, so both sides compare like for like.
function sameSpan(){ const it=ITEMS.find(i=>i.id===state.item); return !!(it&&it.annual); }
function topicUnits(){
  return ITEMS.filter(i=>i.kind!=="custom").map(i=>({hl:i.hl, kind:i.kind, ktag:i.tag, ...(i.annual?{cost:()=>i.scen[scenOf(i)][0]*(sameSpan()?state.years:1)}:{}), e:i.icon.slice(2), n:i.title, p:i.scen[scenOf(i)][0], topic:i.id, tags:TAGS[i.title.de]||[],
    ...(i.annual?{y:1,ny:1,w:W("Jahre","years")}:{})}));
}
// Time tiles: pick the time unit that gives a whole number from 1 to 99 (fraction of a year in, e.g. "58 Stunden" out).
const TIME_UNITS=[[1,["Sekunde","Sekunden"],["second","seconds"]],[60,["Minute","Minuten"],["minute","minutes"]],[3600,["Stunde","Stunden"],["hour","hours"]],
  [86400,["Tag","Tage"],["day","days"]],[604800,["Woche","Wochen"],["week","weeks"]],[2629800,["Monat","Monate"],["month","months"]],[31557600,["Jahr","Jahre"],["year","years"]]];
function timeFmt(yearFrac){
  const secs=yearFrac*31557600;
  const tu=TIME_UNITS.find(([f])=>secs/f<99.5) || TIME_UNITS[TIME_UNITS.length-1];
  const n=Math.max(1,Math.round(secs/tu[0])), names=state.lang==="de"?tu[1]:tu[2];
  return {n, w:names[n===1?0:1]};
}
// Fixed-size 2:1 icon box; icon size shrinks with the count. Above 100 icons, one icon stands for 10, 100, 1,000 ...
// Prices the visitor set on a tile (pencil), keyed by unit name; for group tiles the price per single item.
let PRICE_OV={};
function defaultBase(u){ const d=u.cost?u.cost():u.p; return u.g ? d/u.g.n : d; }
function isEdited(u){ const ov=PRICE_OV[u.n.de]; return ov>0 && Math.abs(ov-defaultBase(u))>0.005; }
function uCost(u){ const ov=PRICE_OV[u.n.de]; if(isEdited(u)) return u.g ? ov*u.g.n : ov; return u.cost?u.cost():u.p; }
function basePrice(u){ return u.g ? uCost(u)/u.g.n : uCost(u); }
function unitCount(u, amt){ const uc=uCost(u); return amt/(u.m?uc*12:uc); }
// The remainder icon is cut to its share of the width (0.4 → left 40 % visible) instead of being faded.
function partIcon(ic, part){
  return `<span class="pcell"><span class="pclip" style="width:${part*100}%;--p:${part}"><span class="ico l-${ic}" style="width:${100/part}%" aria-hidden="true"></span></span></span>`;
}
function pictoParts(c, ic){
  let unit=1; while(c/unit>100) unit*=10;
  const n=c/unit, full=Math.floor(n), part=n-full, total=full+(part>=.15?1:0);
  let cols=1; while(Math.ceil(total/cols)/cols>0.5) cols++;  // rows × cell height must fit the 2:1 box
  const one=`<span class="ico l-${ic}" aria-hidden="true"></span>`;
  return [`<span class="pbox" style="--cols:${cols}" aria-hidden="true">${one.repeat(full)}${part>=.05?partIcon(ic,part):""}</span>`,
          unit>1?t("perSym")(big(unit)):"&nbsp;"];
}
// Free-flowing icon row across the full slide width (same factor rule as the tile boxes).
function pictoFlow(c, ic){
  let unit=1; while(c/unit>100) unit*=10;
  const n=c/unit, full=Math.floor(n), part=n-full, one=`<span class="ico l-${ic}" aria-hidden="true"></span>`;
  return `<div class="pflow" aria-hidden="true">${one.repeat(full)}${part>=.05?partIcon(ic,part):""}</div>`
    + (unit>1?`<span class="pleg">${t("perSym")(big(unit))}</span>`:"");
}
function pictoBox(c, ic){ const [b,l]=pictoParts(c,ic); return b+`<span class="pleg">${l}</span>`; }
// Default comparison: the "griffig" tiles (13–999, same range as the badge), taken round-robin across slides so the mix stays varied, at most 8.
function griffigSel(amt){
  UNITS.topics = topicUnits();
  const per=Object.entries(UNITS).map(([k,list])=>shownIdx(k,amt).map(i=>({key:k+":"+i,u:list[i]})).filter(({u})=>{
    if(u.time||u.topic===state.item||u.hl) return false; const c=unitCount(u,amt); return c>=13&&c<1000; }).map(x=>x.key));
  const unitOf=key=>{const [k,i]=key.split(":"); return UNITS[k][+i];};
  const mine=per.flat().filter(key=>score(unitOf(key))>0).sort((a,b)=>score(unitOf(b))-score(unitOf(a))).slice(0,8);
  const out=[...mine]; for(let r=0; out.length<8 && per.some(l=>l.length>r); r++) per.forEach(l=>{ if(l[r]&&out.length<8&&!out.includes(l[r])) out.push(l[r]); });
  return out;
}
function hbars(rows){
  const max=Math.max(...rows.map(r=>r.v));
  return `<div class="hb">${rows.map(r=>`<span class="lb${r.hi?" hi":""}">${r.label}</span><div class="tr"><div class="fl${r.hi?" hi":""}" style="width:${r.v/max*100}%"></div></div><span class="vv${r.hi?" hi":""}">${r.txt}</span>`).join("")}</div>`;
}
const CITIES=[["Göttingen",118e3],["Freiburg",236e3],["Leipzig",620e3],["Frankfurt am Main",775e3],["Köln",1.08e6],["München",1.5e6],["Hamburg",1.9e6],["Berlin",3.9e6],["Bayern",13.4e6],["NRW",18e6],["Deutschland",83.6e6]];
const ROUTES=[[35,W("Berlin–Potsdam","Berlin–Potsdam")],[290,W("Berlin–Hamburg","Berlin–Hamburg")],[585,W("Berlin–München","Berlin–Munich")],[1000,W("Flensburg–Garmisch","Flensburg–Garmisch")],[40075,W("einmal um die Erde","once around the Earth")],[384400,W("die Strecke zum Mond","the distance to the Moon")]];
// Roughly how many schools a place has: Germany has about 32,000 general schools for 83.6 m people (≈ 1 per 2,600).
// Schools per place: real counts where known (Destatis 2024/25: 32,836 nationwide; München 355), otherwise estimated.
// Big cities have larger schools: about 1 school per 4,200 people (München), elsewhere 1 per 2,550 (national average).
const SCHOOLS_REAL={"München":355,"Berlin":662,"Hamburg":558,"Köln":320,"Leipzig":283,"Frankfurt am Main":211,"Deutschland":32836};
function schoolsIn(name,pop){ return SCHOOLS_REAL[name] ?? Math.max(1,Math.round(pop/(pop>=500e3?4200:2550))); }
function schoolRefs(n){
  const PL=[["Helgoland",1.4e3],["Sylt",18e3],["Garmisch-Partenkirchen",27e3],["Tübingen",92e3],...CITIES];
  const est=PL.map(([name,pop])=>[name,schoolsIn(name,pop),SCHOOLS_REAL[name]!=null]);
  const below=est.filter(x=>x[1]<=n).slice(-2), above=est.filter(x=>x[1]>n).slice(0,2);
  const rows=[...below,...above].map(([name,v,real])=>({label:t("schoolsIn")(name),v,txt:(real?"":"≈ ")+big(v)}));
  const myst=STATES.find(x=>x[0]===PROFILE.state); if(myst){ const v=Math.round(myst[2]/2550); rows.push({label:t("schoolsIn")(myst[1])+` (${t("myState")})`,v,txt:"≈ "+big(v)}); }
  return rows;
}
function priceOf(name,fallback){ const u=Object.values(UNITS).flat().find(x=>x.n&&x.n.de===name); return u?uCost(u):fallback; }
// Editable numbers inside the lead sentences. A-values are assumptions; P-values are tile prices.
function fmtIn(v){ v=Math.round(v*100)/100; return state.lang==="de"?String(v).replace(".",","):String(v); }
function inlField(attr, val, label, title){
  const v=fmtIn(val);
  return `<input class="inl" type="text" inputmode="decimal" enterkeyhint="done" autocomplete="off" spellcheck="false" ${attr} value="${v}" aria-label="${label}" title="${title}" style="width:calc(${v.length}ch + 1.2em)">`;
}
function inl(key, val){ const a=t("a")[key]||["",""]; return inlField(`data-a="${key}"`, val, a[0], `${a[0]} · ${a[1]}`); }
function inlP(name, val){ return inlField(`data-p="${name}"`, val, `${t("editPrice")}: ${name}`, t("editPrice")); }
function renderIllus(amt){
  const L=state.lang;
  // Shared lead block: subject icon + headline + one-line recipe, the result as "= N unit", a personal line, then extras.
  const lead=(ic,t1,t2,n,u,mine,sub,extra="",icHtml="")=>`<div class="dn">${icHtml||`<span class="ico dn-ic l-${ic}" aria-hidden="true"></span>`}<span class="dn-t1">${t1}</span><span class="dn-t2">${t2}</span></div>
    <div class="dn-res"><span class="dn-eq">=</span><span class="dn-n">${n}</span><span class="dn-u">${u}</span></div>${mine?`<p class="dn-daily">${mine}</p>`:""}${sub?`<p class="sub">${sub}</p>`:""}${extra}`;
  // Everyday: a Döner a day, in lifetimes
  const DP=priceOf("Döner",8), yrs=amt/DP/365, lives=yrs/81;
  // Bars: people who could eat a Döner every day of their life, next to town and city populations
  const TOWNS=[["Helgoland",1.4e3],["Sylt",18e3],["Garmisch-Partenkirchen",27e3],["Tübingen",92e3],...CITIES];
  const tb=TOWNS.filter(c=>c[1]<=lives).slice(-1), ta=TOWNS.filter(c=>c[1]>lives).slice(0,2);
  $("illus-every").innerHTML = lead("sandwich",t("dnT1"),t("dnT2")(inlP("Döner",DP),nf(365*81)),big(lives>=1?lives:yrs),lives>=1?t("lives"):t("years2"),
    (()=>{ const km=amt/DP*0.25/1000, e=km/40075; return t("dnLen")(big(km), e>=1?t("timesAround")(nf(e,e<10?1:0)):t("pctAround")(nf(e*100,e<0.1?1:0))); })(),lives>=1?t("dnT3")(1):t("dnT3")(0),
    lives>=1?hbars([{label:t("dnBar"),v:lives,txt:big(lives)+" "+t("people"),hi:1},...[...tb,...ta].slice(0,3).map(c=>({label:c[0],v:c[1],txt:big(c[1])}))].sort((a,b)=>b.v-a.v)):"");
  // Per year: a year of groceries for households, vs city populations
  const hw=t("hhWords")[PROFILE.home]||t("hhWords").kids, hhn=amt/(A.grocery*12), hhp=(HH[PROFILE.home]||HH.kids)[1], ppl=hhn*hhp;
  const below=CITIES.filter(c=>c[1]<=ppl).slice(-1), above=CITIES.filter(c=>c[1]>ppl).slice(0,2);
  const refs=[...below,...above].slice(0,3).map(c=>({label:c[0],v:c[1],txt:big(c[1])}));
  const myst=STATES.find(x=>x[0]===PROFILE.state); if(myst) refs.push({label:`${myst[1]} (${t("myState")})`,v:myst[2],txt:big(myst[2])});
  $("illus-month").innerHTML = lead("shopping-cart",t("mT1"),t("mT2")(inl("grocery",A.grocery),hw[2]),big(hhn),hw[1],t("mAll")(daySpan(amt/(POP*(A.grocery/hhp)*12/365.25))),t("illMonth")(hw[2]),
    hbars([{label:t("you"),v:ppl,txt:big(ppl)+" "+t("people"),hi:1},...refs].sort((a,b)=>b.v-a.v)));
  // Petrol: one full tank; personal line depends on how the visitor gets around
  const fill=A.tank*A.price, fills=amt/fill;
  const liters=fills*A.tank;
  const carMine = t("cFuel")(big(liters),big(liters/2.5e6),big(liters*2.37/1000));
  const carSub = PROFILE.move==="transit" ? t("illCarTransit")(big(amt/(DT.full*12)),big(amt/(DT.fare*12)),eur(DT.bundM+DT.laenderM))
    : PROFILE.move==="bike" ? t("illCarBike")(big(amt/900),big(amt/1e6))
    : PROFILE.move==="car" ? t("illCarCar")(nf(A.cons,1),nf(A.tank)) : "";
  $("illus-car").innerHTML = lead("fuel",t("cT1"),t("cT2")(inl("tank",A.tank),inl("price",A.price),eurFine(fill),inl("cons",A.cons),inl("power",A.power)),big(fills),t("cU"),carMine,carSub);
  // Purchases: new Golfs bumper to bumper
  const GP=priceOf("Neuer VW Golf",32000), golfs=amt/GP, jam=golfs*0.007, rt=ROUTES.filter(r=>r[0]<=jam).slice(-1)[0]||ROUTES[0], nxt=ROUTES[ROUTES.indexOf(rt)+1];
  $("illus-buy").innerHTML = lead("car",t("bT1"),t("bT2")(inlP("Neuer VW Golf",GP)),big(jam),t("jam"),t("bWeight")(big(golfs*1.3),nf(golfs*1.3/10100,golfs*1.3/10100<10?1:0)),t("illBuy")(nf(jam/rt[0],jam/rt[0]<10?1:0)+" ×",rt[1][L]),
    hbars([{label:t("jamLbl"),v:jam,txt:big(jam)+" km",hi:1},{label:rt[1][L],v:rt[0],txt:big(rt[0])+" km"},...(nxt?[{label:nxt[1][L],v:nxt[0],txt:big(nxt[0])+" km"}]:[])].sort((a,b)=>b.v-a.v)));
  // Public: building new schools (one-off); a year of a school's staff as the running-cost alternative
  const sch=amt/(A.schoolBuild*1e6), pct=sch/32000*100;
  $("illus-pub").innerHTML = lead("school",t("pT1"),t("pT2")(inl("schoolBuild",A.schoolBuild)),big(sch),t("schoolsW")[1],t("pStaff")(big(amt/(A.staff*A.staffCost)),inl("staff",A.staff),inl("staffCost",A.staffCost)),t("illPub")(nf(pct,pct<1?2:1),big(sch*500)),
    hbars([{label:t("newSchools"),v:sch,txt:big(sch),hi:1},...schoolRefs(sch)].sort((a,b)=>b.v-a.v)));
  // Megaprojects: the closest famous project
  const PRJ=[[340e6,W("Allianz Arena","Allianz Arena")],[866e6,W("Elbphilharmonie","Elbphilharmonie")],[7e9,W("Flughafen BER","BER airport")],[11.5e9,W("Stuttgart 21","Stuttgart 21")]];
  const near=PRJ.slice().sort((a,b)=>Math.abs(Math.log(amt/a[0]))-Math.abs(Math.log(amt/b[0])))[0], r=amt/near[0];
  $("illus-big").innerHTML = lead("construction",near[1][L],t("gT2")(eur(near[0])),nf(r,r<10?1:0)+" ×",near[1][L],t("gJobs")(big(amt/55000)),"",
    hbars([{label:t("you"),v:amt,txt:eur(amt),hi:1},...PRJ.map(p=>({label:p[1][L],v:p[0],txt:eur(p[0])}))].sort((a,b)=>b.v-a.v)));
  // Per person & time: how long the federal government needs to spend it; the ring sits in the icon slot
  const secs=amt/524.5e9*31557600, tf=timeFmt(amt/524.5e9);
  const tfIdx=TIME_UNITS.findIndex(x=>(L==="de"?x[1]:x[2]).includes(tf.w));
  let si=TIME_UNITS.map(x=>secs/x[0]>=1).lastIndexOf(true); if(si===tfIdx && si>0) si--; if(si<0) si=0;
  const su=TIME_UNITS[si], sn=secs/su[0], sTxt=nf(sn,sn<10?1:0), sW=(L==="de"?su[1]:su[2])[Math.round(sn*10)===10?0:1];
  const nextU=TIME_UNITS[Math.min(si+1,TIME_UNITS.length-1)], rp=Math.min(100,secs/nextU[0]*100);
  const ring=`<div class="bigring dn-ic" style="--pct:${rp}%"><span>${sTxt}<small style="display:block;font-size:.7rem;font-weight:600">${sW}</small></span></div>`;
  const perHead=amt/POP, sh=myShare(amt), it=ITEMS.find(i=>i.id===state.item);
  const lifeMine = sh!==null && it.kind!=="gain" ? t("lMineShare")(eurFine(sh)) : t("lMineHead")(eurFine(perHead));
  $("illus-life").innerHTML = lead("",t("lT1"),t("lT2"),nf(tf.n),tf.w,lifeMine,"","",ring);
}
// A number of days as the friendliest span: days, then months, then years
function daySpan(d){
  const L=state.lang, f=(n,one,many)=>`${n<10?nf(n,1).replace(/[.,]0$/,""):big(n)} ${n>=0.95&&n<1.05?one:many}`;
  if(d<1) return f(d*24, L==="de"?"Stunde":"hour", L==="de"?"Stunden":"hours");
  if(d<60) return f(d, L==="de"?"Tag":"day", L==="de"?"Tage":"days");
  if(d<730) return f(d/30.44, L==="de"?"Monat":"month", L==="de"?"Monate":"months");
  return f(d/365.25, L==="de"?"Jahr":"year", L==="de"?"Jahre":"years");
}
// Size meter: position on a log scale from <1 to 1 Mrd. (10 steps, one per decade), same for every tile.
// Drop a leading word from the name when the grey unit line already says it ("Wochen" + "Wochen Wirtschaftsleistung …" → "Wirtschaftsleistung …").
// Tile names that would repeat the grey unit word get a short form.
const SHORTNAME={
  "Ein Leben lang einkaufen (1 Person)":()=>{ const m=eur(A.grocery/(HH[PROFILE.home]||HH.kids)[1]); return state.lang==="de"?[`Einkauf für 1 Person, ${m} im Monat, 81 Jahre lang`]:[`groceries for 1 person, ${m} a month for 81 years`]; },
  "Arbeitsleben (Ø netto)":["Ø netto, rund 43 Berufsjahre","avg. net, about 43 years of work"],
  "Arbeitsstunden zum Ø-Nettolohn":["Arbeit zum Ø-Nettolohn (16,76 €)","work at avg. net pay (€16.76)"],
  "Stunden Arbeit zum Mindestlohn":["Arbeit zum Mindestlohn (13,90 €)","work at minimum wage (€13.90)"],
  "Medianvermögen eines Haushalts":["mit Medianvermögen (103.200 €)","with median wealth (€103,200)"],
  "Ø Altersrente (1.250 €/Monat)":["Ø 1.250 € im Monat","avg. €1,250 a month"],
  "Kita-Beitrag (200 €/Monat)":["Ø 200 € im Monat","avg. €200 a month"],
  "Kindergeld":["255 € im Monat pro Kind","€255 a month per child"],
  "Musik-Streaming-Abo":["Musik-Streaming","music streaming"],
  "Golfclub-Mitgliedschaft":["im Golfclub","of a golf club"],
  "Arbeitsjahre (Ø netto, Vollzeit)":["Ø netto, Vollzeit","avg. net, full-time"],
  "Steuerjahre bei 50.000 € brutto (grob)":["bei 50.000 € brutto (grob)","at €50k gross (rough)"]
};
function tileName(u, unit){ let sn=SHORTNAME[u.n.de]; if(typeof sn==="function") return unit?sn()[0]:u.n[state.lang]; return sn&&unit ? sn[state.lang==="de"?0:1] : dedupeName(u.n[state.lang],unit); }
function dedupeName(name, unit){
  const u=(unit||"").trim(); if(!u) return name;
  const words=u.split(" "), cands=[u, words[words.length-1], words[0]];
  for(const c of cands){
    if(!name.toLowerCase().startsWith(c.toLowerCase()+" ")) continue;
    let rest=name.slice(c.length).trim().replace(/^of /i,"").replace(/^\((.*)\)$/,"$1");
    if(!rest) return name;
    return state.lang==="en" ? rest[0].toUpperCase()+rest.slice(1) : rest;
  }
  return name;
}
function meterPos(n){ return Math.min(10, n<1 ? Math.max(n,0) : 1+Math.log10(n)); }
function meter(n){ return `<span class="meter" aria-hidden="true"><span class="mfill" style="width:${meterPos(n)*10}%"></span></span>`; }
const METER_SCALE=()=>`<span class="mscale" aria-hidden="true">${[[1,"1"],[4,state.lang==="de"?"1 Tsd.":"1k"],[7,state.lang==="de"?"1 Mio.":"1m"],[10,state.lang==="de"?"1 Mrd.":"1bn"]].map(([p,l])=>`<span style="left:${p*10}%">${l}</span>`).join("")}</span>`;
// The same item (e.g. Döner, or a round of Döner for Köln) appears only once per slide.
const SAME={"Kugeln Eis":"Kugel Eis","Kinotickets":"Kinoticket","Monats-Deutschlandtickets":"Deutschlandticket","Monatsmieten":"Miete","Mieten":"Miete","Miete, 70 m²":"Miete","iPhones":"iPhone",
  "Reihenhäuser":"Reihenhaus","Festivaltickets":"Festivalticket","E-Busse":"Elektrobus","Jahresgehälter":"Lehrkraft","Bier":"Bier im Stadion","Solaranlagen":"Solaranlage aufs Dach","Tankfüllungen":"Tankfüllung"};
function itemKey(u){ const k=u.g?u.g.item.de:u.n.de; return SAME[k]||k; }
let TOP_OPP_TOTAL=0;
function topicIdx(list, amt){
  const it=ITEMS.find(i=>i.id===state.item), cost=it.kind!=="gain";
  const c=list.map(u=>Math.abs(Math.log10(unitCount(u,amt))));
  const idx=list.map((u,i)=>i).filter(i=>list[i].topic!==state.item), near=(a,b)=>c[a]-c[b];
  const opp=idx.filter(i=>(list[i].kind==="gain")===cost).sort(near), same=idx.filter(i=>(list[i].kind==="gain")!==cost && !list[i].hl).sort(near);
  TOP_OPP_TOTAL=opp.length;
  return [...(topMore?opp:opp.slice(0,12)), ...same];
}
function shownIdx(k, amt){
  const list=UNITS[k]; if(k==="topics") return topicIdx(list, amt);
  const items=list.map((u,i)=>({i,u,c:unitCount(u,amt)})).map(x=>({...x,b:bucketOf(x.c)}));
  const pick=[], used=new Set(), keys=new Set();
  for(let b=0;b<BUCKETS;b++){
    const cand=items.filter(x=>x.b===b&&!used.has(x.i)&&!keys.has(itemKey(x.u))).sort((x,y)=>score(y.u)-score(x.u)||x.i-y.i);
    if(cand[0]){ pick.push(cand[0]); used.add(cand[0].i); keys.add(itemKey(cand[0].u)); }
  }
  // ranges this pool cannot reach: fill up to 10 with the units closest to an empty range
  const empty=[...Array(BUCKETS).keys()].filter(b=>!pick.some(x=>x.b===b));
  const rest=items.filter(x=>!used.has(x.i)).sort((x,y)=>score(y.u)-score(x.u)||Math.min(...empty.map(b=>Math.abs(b-x.b)))-Math.min(...empty.map(b=>Math.abs(b-y.b)))||x.i-y.i);
  while(pick.length<10&&rest.length){ const x=rest.shift(); if(keys.has(itemKey(x.u))) continue; pick.push(x); keys.add(itemKey(x.u)); }
  return pick.sort((x,y)=>x.c-y.c).map(x=>x.i);
}
// "Other topics": tiles of the opposite kind (ways to pay for a cost, or what a gain could pay for) come first and are coloured by kind.
let topMore=false;
function splitTopics(amt){
  const L=state.lang, it=ITEMS.find(i=>i.id===state.item), cost=it.kind!=="gain";
  const tiles=[...$("tiles-topics").children];
  const info=tl=>UNITS.topics[+tl.dataset.key.split(":")[1]];
  // both groups: closest to "1 ×" first, using the span-adjusted count (yearly topics over the same years)
  const near=(a,b)=>Math.abs(Math.log10(unitCount(info(a),amt)))-Math.abs(Math.log10(unitCount(info(b),amt)));
  const opp=tiles.filter(tl=>(info(tl).kind==="gain")===cost).sort(near);
  const same=tiles.filter(tl=>(info(tl).kind==="gain")!==cost && !info(tl).hl).sort(near);
  const mark=(tl,u)=>{ const g=u.kind==="gain"; tl.style.setProperty("--kc",g?"var(--gain)":"var(--loss)"); tl.classList.add("ktile",g?"kgain":"kloss");
    const nm=tl.querySelector(".nm"); if(nm&&!nm.querySelector(".kpill")) nm.insertAdjacentHTML("afterbegin",`<span class="kpill">${u.ktag?u.ktag[L]:(g?t("kGain"):t("kCost"))}</span>`); };
  const LIMIT=12, shown=topMore?opp:opp.slice(0,LIMIT);
  $("tiles-topics-a").replaceChildren(...shown.map(tl=>{ mark(tl,info(tl)); return tl; }));
  $("tiles-topics-b").replaceChildren(...same.map(tl=>{ mark(tl,info(tl)); return tl; }));
  $("top-more").hidden=TOP_OPP_TOTAL<=LIMIT; $("top-more").textContent=topMore?t("topLess"):t("topAll")(TOP_OPP_TOTAL);
  $("top-a-h").textContent=cost?t("topAH_cost"):t("topAH_gain"); $("top-a-sub").textContent=(cost?t("topAS_cost"):t("topAS_gain"))+(it.annual?" "+t("topSpan")(state.years):"");
  $("top-b-h").textContent=cost?t("topBH_cost"):t("topBH_gain"); $("top-b-sub").textContent=t("topBS");
  $("cmp-topics").querySelector("h2").textContent=cost?t("topH_cost"):t("topH_gain");
}
// Slides in page order. Only the visible slide and its neighbours are rebuilt on a change; the others are marked stale
// and rebuilt when the visitor moves to them (markSlide). This keeps DOM work and layout small.
const SLIDE_KEYS=["every","month","buy","car","pub","big","life"];
let STALE=new Set(), LAST_AMT=0;
function renderTiles(amt){
  UNITS.topics = topicUnits(); LAST_AMT=amt;
  const near=new Set([slide-1,slide,slide+1].map(i=>SLIDE_KEYS[i]).filter(Boolean));
  Object.keys(UNITS).forEach(k=>{ if(k==="topics"||near.has(k)) renderTileSet(k,amt); else STALE.add(k); });
}
function renderStaleNear(){
  [slide-1,slide,slide+1].map(i=>SLIDE_KEYS[i]).filter(k=>k&&STALE.has(k)).forEach(k=>renderTileSet(k,LAST_AMT));
}
function renderTileSet(k, amt){
  const L=state.lang, list=UNITS[k]; STALE.delete(k);
  {
    const el=$("tiles-"+k); if(!el) return;
    el.innerHTML=shownIdx(k,amt).map(idx=>({u:list[idx],idx})).sort((a,b)=>score(b.u)-score(a.u)).map(({u,idx})=>{
      if(u.topic===state.item) return "";
      const key=k+":"+idx, on=state.sel.includes(key);
      const unitCost=uCost(u), per=u.m?unitCost*12:unitCost, c=amt/per;
      let cTxt, w;
      if(u.time){ const tf=timeFmt(c); cTxt=nf(tf.n); w=tf.w; }
      else { cTxt = c<1 ? nf(c,2) : big(c); w = u.w ? `${u.w[L]}${(u.m||u.y)&&!u.ny?" "+t("yearOf"):""}` : ""; }
      if(u.topic && u.y && sameSpan()){ cTxt = (c<1?nf(c,2):big(c))+" ×"; w = t("overYears")(state.years); }
      if(w && Math.abs(c-1)<0.05) w = w.replace(/^Jahre\b/,"Jahr").replace(/^years\b/,"year");
      const pr = u.time ? "" : (u.topic && u.y && sameSpan()) ? t("prSpan")(eur(unitCost),state.years) : u.prTxt ? u.prTxt(L) : eur(unitCost)+(u.m?t("perMonth"):u.y?t("perYear"):"");
      const dc = c;   // group tiles lead with how often the group fits; the individual count goes to the name line
      const tier = dc<1 ? "frac" : dc<13 ? "few" : dc<1000 ? "fit" : dc<1e6 ? "thou" : "mega";
      // Every tile has the same 7 slots (visual, scale, number, unit, name, price, context) on a shared subgrid, so rows line up across tiles.
      // Visual: one icon to recognise the item + a size meter on the same 1 … 1 Mrd. scale for every tile, so tiles compare at a glance.
      let vis=`<span class="tvis"><span class="ico tic l-${u.e}" aria-hidden="true"></span></span>`, leg="", cH=cTxt, wT=w||"", ctx="";
      if(tier==="frac"){ const pct=Math.max(dc*100,0.1); cH=`${nf(pct,pct<1?2:pct<10?1:0)} %`; wT=(u.topic&&u.y&&sameSpan())?t("fracOverYears")(state.years):u.ny?t("fracYear"):t("fracOf"); }
      if(u.g){ cH = dc<1 ? cH : `${big(dc)} ×`; wT=u.g.grp[L]; }
      else {
        if(tier==="thou") ctx=`<span class="ico ci l-${dc>=75000?"goal":"train-front"}" aria-hidden="true"></span>` + (dc>=75000 ? t("ctxStadium")(nf(dc/75000,dc<750000?1:0)) : t("ctxIce")(nf(dc/900,dc<9000?1:0)));
        if(tier==="mega"){ const pl=PLACES.filter(p=>p[0]<=dc).pop(), per=dc/pl[0]; ctx=`<span class="ico ci l-map-pin" aria-hidden="true"></span>${t("ctxPlace")(nf(per,per<10?1:0), pl[1][L])}`; }
        if(c>=1){
          if((k==="every"||k==="car") && unitCost<1000 && !u.per) ctx=`<span class="ico ci l-calendar-days" aria-hidden="true"></span>${t("daily")(daySpan(c))}`;
          else if(k==="month" && u.m) ctx=`<span class="ico ci l-calendar-days" aria-hidden="true"></span>${t("mineOnly")(daySpan(c*365.25))}`;
          else if((k==="buy"||k==="car") && unitCost<200000) ctx=`<span class="ico ci l-calendar-days" aria-hidden="true"></span>${t("yearly")(daySpan(c*365.25))}`;
        }
      }
      const body=`<span class="vis">${vis}</span><span class="pleg">${leg}</span><span class="c">${cH}</span><span class="w">${wT}</span><span class="nm">${score(u)>0?`<span class="foryou">${t("forYou")} · ${reasons(u).slice(0,2).map(x=>TAGSHORT[x][L]).join(", ")}</span>`:""}${u.g?`= ${big(c*u.g.n)} ${u.g.item[L]}`:tileName(u,wT)}</span><span class="pr">${u.topic?pr:`${isEdited(u)?`<span class="pmod">${t("edited")}</span> `:""}${pr}<button type="button" class="pedit" data-edit="${key}" aria-label="${t("editPrice")}: ${u.n[L]}" title="${t("editPrice")}"><span class="ico l-pencil" aria-hidden="true"></span></button>`}</span><span class="ctx${ctx?"":" empty"}">${ctx}</span>`;
      return `<div class="tile ${tier}${on?" sel":""}" data-key="${key}" role="button" tabindex="0" aria-pressed="${on}" title="${t("selTip")}" data-fit="${t("fit")}">${body}<span class="selmark" aria-hidden="true"><span class="ico l-${on?"check":"plus"}" aria-hidden="true"></span></span></div>`;
    }).join("");
  }
}
const A = { schoolBuild:30, staff:40, staffCost:78500, tank:50, cons:7.5, price:2.2, power:0.37, grocery:950 };
const A_DEF = {...A};  // defaults for "Zurück zu den Standardwerten"
const POP = 83.6e6, EARTH = 40075, MOON_RT = 768800, SUN = 149.6e6;
const state = { lang:"de", item:"masken", scen:"mid", years:1, custom:1, sel:["every:0","month:0","pub:5","big:4"] };

const $ = id => document.getElementById(id);
const t = k => I18N[state.lang][k];
const loc = () => state.lang==="de" ? "de-DE" : "en-GB";
const nf = (n,d=0) => n.toLocaleString(loc(),{maximumFractionDigits:d,minimumFractionDigits:0});

function big(n){ // compact count
  const a = Math.abs(n);
  if(a>=1e9) return nf(n/1e9,a>=1e10?0:1)+" "+t("bn");
  if(a>=1e6) return nf(n/1e6,a>=1e7?0:1)+" "+t("mn");
  if(a>=100) return nf(Math.round(n));
  if(a>=10) return nf(n,1);
  return nf(n,a<1?2:1);
}
function eur(n){
  const a=Math.abs(n), de=state.lang==="de";
  let s;
  if(a>=1e9) s=nf(n/1e9,a>=1e11?0:1)+" "+t("bn");
  else if(a>=1e6) s=nf(n/1e6,a>=1e8?0:1)+" "+t("mn");
  else s=nf(n,a<100?2:0);
  return de ? s+" €" : "€"+s;
}
function eurFine(n){ return n.toLocaleString(loc(),{style:"currency",currency:"EUR",maximumFractionDigits:2}); }

function scenOf(it,scen=state.scen){ const k=Object.keys(it.scen); return k.includes(scen)?scen:(k.includes("mid")?"mid":k[0]); }
function amount(id=state.item, scen=state.scen){
  const it = ITEMS.find(i=>i.id===id);
  if(it.kind==="custom") return state.custom*1e9;
  const base = it.scen[scenOf(it,scen)][0];
  return it.annual ? base*state.years : base;
}

// Any change to the amount (topic, estimate, years, own amount) re-picks the griffig default comparison.
function resetSel(){ state.sel=griffigSel(amount()); selBeforeAll=null; }
function selectItem(id){ state.item=id; state.sel=griffigSel(amount()); history.replaceState(null,"","#"+state.item); renderStatic(); render(); }
// Runs a change behind an input-blocking overlay. The overlay is shown first, painted, then the work runs;
// it is removed after queued clicks have landed on it, so nothing is triggered twice.
let BUSY=false;
function busy(fn){
  if(BUSY) return; BUSY=true;
  const ov=$("busy"); ov.hidden=false; document.documentElement.setAttribute("aria-busy","true");
  requestAnimationFrame(()=>setTimeout(()=>{
    try{ fn(); } finally { setTimeout(()=>{ ov.hidden=true; document.documentElement.removeAttribute("aria-busy"); BUSY=false; }, 0); }
  }, 0));
}
// Continuous inputs (sliders, typing) render at most once per frame
let RAF_PENDING=false;
function renderSoon(){ if(RAF_PENDING) return; RAF_PENDING=true; requestAnimationFrame(()=>{ RAF_PENDING=false; render(); }); }
let STATIC_LANG=null, PICKER_KEY=null;
function renderStatic(){
  document.documentElement.lang = state.lang;
  const langChanged = STATIC_LANG!==state.lang; STATIC_LANG=state.lang;
  if(langChanged) document.querySelectorAll("[data-i]").forEach(el=>{ const v=t(el.dataset.i); if(typeof v==="string") el.textContent=v; });
  $("lang-de").setAttribute("aria-pressed", state.lang==="de");
  $("lang-en").setAttribute("aria-pressed", state.lang==="en");
  document.title = t("title");
  // picker
  const card = it=>{
    const tag = it.tag ? it.tag[state.lang] : it.kind==="custom"?t("customTag"):it.kind==="gain"?t("gainTag"):it.annual?t("costTag"):t("lossTag");
    const cls = it.kind==="loss"?"loss":"gain";
    return `<button type="button" class="pick" data-id="${it.id}" aria-pressed="${it.id===state.item}">
      <span class="ico pi ${it.icon}" aria-hidden="true"></span><span class="k ${cls}">${tag}</span><span class="t">${it.title[state.lang]}</span><span class="s">${it.short[state.lang]}</span></button>`;
  };
  const pickerKey=[state.lang,state.pq||"",state.parea||""].join("|");
  if(pickerKey===PICKER_KEY){ $("picker").querySelectorAll(".pick").forEach(b=>b.setAttribute("aria-pressed",b.dataset.id===state.item)); }
  else { PICKER_KEY=pickerKey;
  const keep={}; $("picker").querySelectorAll(".prow").forEach(r=>keep[r.id]=r.scrollLeft);
  const row=(id,lab,color,list)=>`<div class="pgroup"><div class="phead"><span class="dot" style="background:${color}"></span><span class="eyebrow">${t(lab)}</span>
      <div class="arrows"><button type="button" class="arrow" data-row="${id}" data-dir="-1" aria-label="${t("prevL")}"><span class="ico l-chevron-left" aria-hidden="true"></span></button><button type="button" class="arrow" data-row="${id}" data-dir="1" aria-label="${t("nextL")}"><span class="ico l-chevron-right" aria-hidden="true"></span></button></div></div>
    <div class="prow" id="${id}">${list.map(card).join("")}</div></div>`;
  const q=(state.pq||"").trim().toLowerCase(), ar=state.parea||"";
  const match=i=>(!q||(i.title[state.lang]+" "+i.short[state.lang]).toLowerCase().includes(q)) && (!ar || (ar==="own"?!i.hl:i.area===ar));
  const neg=ITEMS.filter(i=>i.kind==="loss"&&match(i)), pos=ITEMS.filter(i=>i.kind==="gain"&&match(i));
  $("pick-count").textContent=t("pickCount")(neg.length+pos.length);
  $("pick-area").innerHTML=`<option value="">${t("allAreas")}</option><option value="own">${t("ownTopics")}</option>`+Object.entries(AREAS).map(([k,v])=>`<option value="${k}">${v[state.lang==="de"?0:1]}</option>`).join("");
  $("pick-area").value=ar;
  $("picker").innerHTML = (neg.length?row("prow-neg","grpNeg","var(--loss)",neg):"")
    + (pos.length?row("prow-pos","grpPos","var(--gain)",pos):"")
    + (neg.length+pos.length?"":`<p class="sub">${t("noMatch")}</p>`)
    + `<div class="pgroup"><div class="phead"><span class="eyebrow">${t("grpCustom")}</span></div>${card(ITEMS.find(i=>i.kind==="custom")).replace('class="pick"','class="pick pick-custom"')}</div>`;
  $("picker").querySelectorAll(".prow").forEach(r=>{ r.style.scrollBehavior="auto"; r.scrollLeft=keep[r.id]||0; r.style.scrollBehavior=""; });
  $("picker").querySelectorAll(".arrow[data-row]").forEach(b=>b.onclick=()=>{const r=$(b.dataset.row); r.scrollBy({left:+b.dataset.dir*Math.max(250,r.clientWidth*.8)});});
  $("picker").querySelectorAll(".pick").forEach(b=>b.onclick=()=>busy(()=>selectItem(b.dataset.id)));
  }
  // scenario
  const curIt=ITEMS.find(i=>i.id===state.item), avail=curIt.kind==="custom"?[]:Object.keys(curIt.scen);
  $("scen").innerHTML = ["low","mid","high"].filter(s=>avail.includes(s)).map(s=>`<button type="button" data-s="${s}" aria-pressed="${s===scenOf(curIt)}">${t(s)}</button>`).join("");
  $("sb-scen").innerHTML = $("scen").innerHTML;
  [$("scen"),$("sb-scen")].forEach(g=>g.querySelectorAll("button").forEach(b=>b.onclick=()=>busy(()=>{state.scen=b.dataset.s; resetSel(); renderStatic(); render();})));
  // assumptions
  renderSources();
  const BASE=document.documentElement.dataset.base||"/", fi=$("f-imp"), fp=$("f-priv"); if(fi){ fi.href=BASE+(state.lang==="de"?"impressum/":"en/imprint/"); fi.textContent=state.lang==="de"?"Impressum":"Imprint"; fp.href=BASE+(state.lang==="de"?"datenschutz/":"en/privacy/"); fp.textContent=state.lang==="de"?"Datenschutz":"Privacy"; }
  $("a-reset").hidden = !Object.keys(A_EDIT).length;
  const nP=Object.values(UNITS).flat().filter(u=>!u.topic&&isEdited(u)).length;
  $("p-reset").hidden = !nP; $("p-reset").textContent = t("pReset")(nP);
  $("pick-q").placeholder=t("searchPh");
  renderProfile();
  const opt=i=>`<option value="${i.id}">${i.title[state.lang]}</option>`;
  $("sb-select").innerHTML = `<optgroup label="${t("grpNeg")}">${ITEMS.filter(i=>i.kind==="loss"&&!i.hl).map(opt).join("")}</optgroup>`
    + `<optgroup label="${t("grpPos")}">${ITEMS.filter(i=>i.kind==="gain"&&!i.hl).map(opt).join("")}</optgroup>`
    + Object.entries(AREAS).map(([k,v])=>{ const l=ITEMS.filter(i=>i.hl&&i.area===k); return l.length?`<optgroup label="${t("moreProps")} · ${v[state.lang==="de"?0:1]}">${l.map(opt).join("")}</optgroup>`:""; }).join("")
    + `<optgroup label="${t("grpCustom")}">${ITEMS.filter(i=>i.kind==="custom").map(opt).join("")}</optgroup>`;
  $("sb-select").value = state.item;
  const icons=["sandwich","calendar","shopping-bag","fuel","school","construction","user"];
  $("chips").innerHTML = t("slides").map((n,i)=>`<button type="button" class="chip" role="tab" data-s="${i}" aria-selected="${i===slide}"><span class="ico l-${icons[i]}" aria-hidden="true"></span>${n}</button>`).join("");
  $("chips").querySelectorAll(".chip").forEach(b=>b.onclick=()=>goSlide(+b.dataset.s));
  $("prev").setAttribute("aria-label",t("prevL")); $("next").setAttribute("aria-label",t("nextL"));
}
let slide=0;
const slides=()=>[...$("panels").children];
function goSlide(i){
  const n=slides().length; slide=Math.max(0,Math.min(n-1,i));
  $("panels").scrollTo({left:slides()[slide].offsetLeft-$("panels").offsetLeft});
  markSlide();
}
function fitHeight(){ const sl=slides()[slide]; if(sl) $("panels").style.height=sl.offsetHeight+"px"; }
let restoring=true;
function loadState(){ try{ return JSON.parse(localStorage.getItem("steuerbeleg-state")||"null"); }catch(e){ return null; } }
function saveState(){
  if(restoring) return;
  try{ localStorage.setItem("steuerbeleg-state",JSON.stringify({lang:state.lang,item:state.item,scen:state.scen,years:state.years,custom:state.custom,sel:state.sel,slide,A,av:2,aedit:A_EDIT,prices:PRICE_OV})); }catch(e){}
}
function markSlide(){
  saveState();
  if(typeof renderStaleNear==="function" && LAST_AMT) renderStaleNear();
  requestAnimationFrame(fitHeight);
  $("chips").querySelectorAll(".chip").forEach((b,i)=>b.setAttribute("aria-selected",i===slide));
  $("prev").disabled=slide===0; $("next").disabled=slide===slides().length-1;
}

function picto(el, legendEl, count, sym, words){
  let unit=1; while(count/unit>120) unit*=10;
  const exact=count/unit, full=Math.floor(exact), part=exact-full;
  let html=""; for(let i=0;i<full;i++) html+=`<span class="ico ${sym}" aria-hidden="true"></span>`;
  if(part>=0.05) html+=partIcon(sym.replace(/^l-/,""),part);
  el.innerHTML=html;
  legendEl.textContent = t("perIcon")(nf(unit), words[unit===1?0:1]);
}

function render(){
  const it = ITEMS.find(i=>i.id===state.item), L=state.lang, amt=amount();
  const isAnnual = !!it.annual, isCustom = it.kind==="custom";
  $("scen-ctl").hidden = isCustom || Object.keys(it.scen).length<2;
  $("years-ctl").hidden = !isAnnual;
  $("custom-ctl").hidden = !isCustom;
  $("years-out").textContent = state.years+" "+t("yearsUnit")[state.years===1?0:1];
  $("sb-years-out").textContent = $("years-out").textContent;
  $("years").value = $("sb-years").value = state.years;
  for(const id of ["custom","sb-custom"]) if(document.activeElement!==$(id)) $(id).value = state.custom;
  $("sb-scen").hidden = $("scen-ctl").hidden; $("sb-years-ctl").hidden = $("years-ctl").hidden; $("sb-custom-ctl").hidden = $("custom-ctl").hidden;
  $("scen-note").textContent = isCustom ? "" : it.scen[scenOf(it)][1][L];
  $("amount-eyebrow").textContent = isCustom ? t("customEyebrow") : isAnnual ? (it.kind==="gain"?t("gainEyebrow"):t("costEyebrow"))(state.years) : t("lossEyebrow");
  $("big").textContent = eur(amt);
  $("big").className = "big";
  $("hero").style.setProperty("--band", it.kind==="loss"?"var(--band-loss)":"var(--band-gain)");
  $("panels").className = "panels "+(it.kind==="loss"?"loss":"gain");
  $("hero-use").className="ico hero-icon "+it.icon;
  $("sb-use").className="ico "+it.icon;
  $("stickybar").style.setProperty("--sb", it.kind==="loss"?"var(--band-loss)":"var(--band-gain)");
  $("sb-select").value = state.item;
  $("sb-m").textContent = isCustom ? t("customTag") : [it.kind==="gain"?t("gainTag").replace(/ pro Jahr| per year/,""):it.annual?t("costTag").replace(/ pro Jahr| per year/,""):t("lossTag"),
     Object.keys(it.scen).length>1?t(scenOf(it)):null, isAnnual?`${state.years} ${t("yearsUnit")[state.years===1?0:1]}`:null].filter(Boolean).join(" · ");
  $("sb-amt").textContent = eur(amt);
  $("who").textContent = it.who[L]; $("who").hidden=!it.who[L];
  $("context").textContent = it.context[L];
  $("caveat").textContent = it.caveat[L]; $("caveat").hidden=!it.caveat[L];
  $("srclinks").hidden=!(it.hl&&it.src);
  if(it.hl) $("srclinks").innerHTML=(it.src?`<a href="${it.src}" target="_blank" rel="noopener">${t("srcLink")} ↗</a>`:"");
  const sh=myShare(amt); $("share").hidden = sh===null || it.kind==="gain";
  if(sh!==null) $("share").innerHTML = `${t("shareTxt")(eurFine(sh))}<small>${t("shareNote")}</small>`;

  // comparisons
  const perSchool = A.schoolBuild*1e6;
  const schools = amt/perSchool;
  const fill = A.tank*A.price, kmPerFill = A.tank/A.cons*100;
  const fills = amt/fill, km = fills*kmPerFill;
  const famYear = A.grocery*12, fams = amt/famYear;
  const perHead = amt/POP;

  $("school-n").innerHTML = big(schools)+`<small>${t("schoolsW")[schools>=1.5||schools<1?1:0]}</small>`;
  $("school-sub").textContent = t("schoolSub")(eur(A.schoolBuild*1e6), nf(A.staff), eur(A.staffCost));
  picto($("school-picto"), $("school-legend"), schools, "l-school", t("schoolsW"));

  const hw=t("hhWords")[PROFILE.home]||t("hhWords").kids;
  $("gro-n").innerHTML = big(fams)+`<small>${hw[1]}</small>`;
  const yrs = fams; const yrsTxt = yrs>=1e6 ? big(yrs)+" "+t("yearsUnit")[1] : nf(Math.round(yrs))+" "+t("yearsUnit")[1];
  $("gro-sub").textContent = t("grocerySub")(eur(A.grocery), yrsTxt, hw[0]);
  picto($("gro-picto"), $("gro-legend"), fams, "l-users", t("famW"));

  $("car-n").innerHTML = big(fills)+`<small>${L==="de"?"Tankfüllungen":"tanks"}</small>`;
  $("car-sub").textContent = t("carSub")(eurFine(fill), nf(A.tank), nf(A.cons,1), eurFine(A.price), nf(kmPerFill));
  $("t-earth").textContent = big(km/EARTH);
  $("t-moon").textContent = big(km/MOON_RT);
  $("t-sun").textContent = big(km/SUN);
  drawDistance(km);

  $("head-n").innerHTML = eurFine(perHead).replace(/\s?€/,"")+`<small>€</small>`;
  if(L==="en") $("head-n").innerHTML = eurFine(perHead);
  $("head-picto").innerHTML = perHead>=1 ? pictoFlow(perHead,"euro") : "";
  $("head-sub").textContent = t("headSub")(nf(perHead/55,1));
  renderTiles(amt);
  splitTopics(amt);
  renderIllus(amt);
  saveState();
  if(typeof fitHeight==="function") requestAnimationFrame(fitHeight);
  renderCompare(amt);
  const exU=UNITS.topics.filter(u=>u.topic!==state.item).map(u=>({u,c:amt/u.p})).sort((a,b)=>Math.abs(Math.log10(a.c)-1)-Math.abs(Math.log10(b.c)-1))[0];
  const exTxt = exU ? t("topEx")(it.title[L], eur(amt), exU.u.y ? `${nf(exU.c,1)} ${L==="de"?"Jahre":"years of"}` : `${nf(exU.c,exU.c<10?1:0)} ${"×"}`, exU.u.n[L]) : "";
  $("top-lede").textContent = t("topLede")(it.title[L], isCustom?t("mid"):t(scenOf(it)), exTxt);
  $("cmp-topics").className = "section-head kc "+(it.kind==="loss"?"loss":"gain");
  $("cmp-sel").className = "section-head kc "+(it.kind==="loss"?"loss":"gain");

}

function unitValue(u, amt){
  const L=state.lang, unitCost=uCost(u), per=u.m?unitCost*12:unitCost, c=amt/per;
  if(u.time){ const tf=timeFmt(c); return {v:tf.n, lab:`${nf(tf.n)} ${tf.w}`}; }
  const num = c<1 ? nf(c,2) : big(c);
  if(u.g) return {v:c, lab:`${num} × ${u.g.grp[L]} (${big(c*u.g.n)} ${u.g.item[L]})`};
  return {v:c, lab: u.w ? `${num} ${u.w[L]}` : `${num} × ${u.n[L]}`};
}
function allUnitKeys(){ const amt=amount(); return Object.entries(UNITS).flatMap(([k,l])=>shownIdx(k,amt).map(i=>({k:k+":"+i,u:l[i]}))).filter(x=>x.u.topic!==state.item&&!x.u.hl).map(x=>x.k); }
let selBeforeAll=null;
function unitByKey(key){ const [k,i]=key.split(":"); return UNITS[k]&&UNITS[k][+i]; }
function openPriceEdit(key){
  const u=unitByKey(key), tl=document.querySelector(`.tile[data-key="${key}"]`); if(!u||!tl) return;
  const pr=tl.querySelector(".pr"), L=state.lang, cur=Math.round(basePrice(u)*100)/100;
  const unitHint=u.g?t("perItem")(u.g.item[L]):u.m?t("perMonth"):u.y?t("perYear"):"";
  pr.innerHTML=`<span class="pform"><label class="vh" for="pf-in">${t("editPrice")}</label><input id="pf-in" type="text" inputmode="decimal" enterkeyhint="done" autocomplete="off" value="${fmtIn(cur)}"><span>€${unitHint}</span>
    <button type="button" class="pf-ok">${t("save")}</button>${isEdited(u)?`<button type="button" class="pf-reset" title="${t("resetPrice")}"><span class="ico l-rotate-ccw" aria-hidden="true"></span>${t("resetPrice")}</button>`:""}</span>`;
  const inp=pr.querySelector("input"); inp.focus(); inp.select();
  const save=()=>{ const v=parseNum(inp.value); if(v>0){ if(Math.abs(v-defaultBase(u))>0.005) PRICE_OV[u.n.de]=v; else delete PRICE_OV[u.n.de]; saveState(); renderStatic(); render(); } };
  pr.querySelector(".pf-ok").onclick=save;
  const rs=pr.querySelector(".pf-reset"); if(rs) rs.onclick=()=>{ delete PRICE_OV[u.n.de]; saveState(); renderStatic(); render(); };
  inp.onkeydown=e=>{ if(e.key==="Enter"){e.preventDefault();save();} if(e.key==="Escape"){e.preventDefault();render();} };
}
function toggleSel(key){
  const i=state.sel.indexOf(key);
  if(i>=0) state.sel.splice(i,1); else { state.sel.push(key); }
  render();
  const el=document.querySelector(`.tile[data-key="${key}"]`); if(el) el.focus({preventScroll:true});
}
function renderCompare(amt){
  const L=state.lang;
  const rows=state.sel.map(key=>{const [k,i]=key.split(":"); const u=UNITS[k]&&UNITS[k][+i]; return u&&u.topic!==state.item?{key,u,...unitValue(u,amt)}:null;}).filter(r=>r&&r.v>0).sort((a,b)=>b.v-a.v);
  const allKeys=allUnitKeys(), isAll=allKeys.every(k=>state.sel.includes(k));
  $("sel-all").textContent = isAll ? t("selAllOff") : t("selAll");
  $("sel-count").textContent=t("selCount")(rows.length);
  $("sel-chips").innerHTML=state.sel.map(key=>{const [k,i]=key.split(":"); const u=UNITS[k]&&UNITS[k][+i]; if(!u) return "";
    return `<button type="button" class="selchip" data-unsel="${key}" aria-label="${t("selRemove")}: ${u.n[L]}"><span class="ico l-${u.e}" aria-hidden="true"></span>${u.n[L]}<span class="x"><span class="ico l-x" aria-hidden="true"></span></span></button>`;}).join("");
  $("sel-chips").querySelectorAll("[data-unsel]").forEach(b=>b.onclick=()=>{state.sel=state.sel.filter(k=>k!==b.dataset.unsel); render();});
  $("sel-empty").hidden=rows.length>0; $("sel-sep").hidden=rows.length===0; $("dots-wrap").hidden=rows.length===0; $("sel-clear").hidden=rows.length===0;
  if(!rows.length) return;
  const maxV=Math.max(...rows.map(r=>r.v));
  const raw=maxV/5, mag=10**Math.floor(Math.log10(raw)), step=[1,2,2.5,5,10].map(m=>m*mag).find(st=>st>=raw), hi=Math.ceil(maxV/step)*step;
  const compact=rows.length>10, W=960, x0=280, x1=900, top=54, rh=compact?38:50, H=top+rows.length*rh+8, dr=compact?6:9;
  const X=v=>x0+v/hi*(x1-x0);
  const svg=$("dots"); svg.setAttribute("viewBox",`0 0 ${W} ${H}`);
  let s="";
  for(let v=0;v<=hi+step/2;v+=step){ const x=X(v);
    s+=`<line x1="${x}" y1="${top-8}" x2="${x}" y2="${H}" stroke="var(--line)"${v===0?' stroke-width="2"':""}/>`;
    s+=`<text x="${x}" y="14" font-size="10" text-anchor="middle" fill="var(--muted)">${v===0?"0":big(v)}</text>`; }
  rows.forEach((r,i)=>{ const y=top+i*rh+rh/2, x=X(r.v);
    s+=`<g class="rowlab" data-unsel="${r.key}" tabindex="0" role="button" aria-label="${t("selRemove")}: ${r.u.n[L]}"><rect x="-4" y="${y-rh/2}" width="${x0-8}" height="${rh}" fill="transparent"/>`;
    s+=`<g class="rm"><circle cx="${x0-26}" cy="${y}" r="10" fill="var(--ink)"/><use href="#l-x" x="${x0-32}" y="${y-6}" width="12" height="12" style="color:var(--paper)"/></g>`;
    s+=`<use href="#l-${r.u.e}" x="0" y="${y-(compact?9:11)}" width="${compact?18:22}" height="${compact?18:22}" style="color:var(--ink)"/>`;
    s+=`<text x="32" y="${y+5}" font-size="13" font-weight="600" fill="var(--ink)" style="font-family:var(--f-body)">${r.u.n[L].length>28?r.u.n[L].slice(0,27)+"…":r.u.n[L]}</text></g>`;
    s+=`<line x1="${x0}" y1="${y}" x2="${x}" y2="${y}" stroke="var(--kc)" stroke-width="3" stroke-linecap="round"/>`;
    s+=`<circle cx="${x}" cy="${y}" r="${dr}" fill="var(--kc)"/>`;
    const tiny = x-x0<4 && r.v>0;
    // Value label beside the dot, on the side with more room; wraps onto a second line when it does not fit in one.
    const full=r.lab+(tiny?` · ${t("tooSmall")}`:""), CW=8.1;  // JetBrains Mono at 13px ≈ 7.8px per character, plus the halo
    // right of the dot when it fits (wrapping to two lines if needed); otherwise left of the dot but above the line, so the stroke never runs through the text
    const roomR=W-4-(x+dr+7), roomL=x-x0+6, fit=room=>wrapLabel(full, Math.max(12,Math.floor(room/CW)));
    const linesR=fit(roomR), cutR=linesR[linesR.length-1].endsWith("…");
    const right=full.length*CW<=roomR || (roomR>=170 && !(cutR && roomL>roomR));
    const lines=right?linesR:fit(roomL);
    const lx=right?x+dr+7:x+dr, anchor=right?"start":"end";
    const y0 = right ? (lines.length>1?y-3:y+5) : y-dr-5-(lines.length-1)*15;
    s+=`<text x="${lx}" y="${y0}" font-size="13" font-weight="600" text-anchor="${anchor}" fill="var(--ink)" stroke="var(--paper)" stroke-width="5" stroke-linejoin="round" paint-order="stroke">${lines.map((ln,i)=>`<tspan x="${lx}" dy="${i?15:0}"${i&&tiny&&ln.includes(t("tooSmall"))?' font-weight="400" fill="var(--muted)"':""}>${ln}</tspan>`).join("")}</text>`;
  });
  svg.innerHTML=s;
  svg.setAttribute("aria-label",rows.map(r=>`${r.u.n[L]}: ${r.lab}`).join("; "));
}
function drawDistance(km){
  const svg=$("dist"), L=t("marks"), W=960, x0=40, x1=920, lo=2, hi=12;
  const X = v => x0 + (Math.log10(Math.max(v,10**lo))-lo)/(hi-lo)*(x1-x0);
  let s=`<line x1="${x0}" y1="90" x2="${x1}" y2="90" stroke="var(--muted)" stroke-width="1"/>`;
  for(let p=lo;p<=hi;p++){
    const x=X(10**p);
    s+=`<line x1="${x}" y1="86" x2="${x}" y2="94" stroke="var(--muted)"/>`;
    s+=`<text x="${x}" y="110" font-size="10" text-anchor="middle" fill="var(--muted)">10${sup(p)} km</text>`;
  }
  const marks=[[585,L.city],[EARTH,L.earth],[MOON_RT,L.moon],[SUN,L.sun],[4.5e9,L.nep],[25e9,L.voy]];
  marks.forEach(([v,lab],i)=>{
    const x=X(v), up=i%2===0, y=up?58:140;
    s+=`<line x1="${x}" y1="${up?64:96}" x2="${x}" y2="${up?84:128}" stroke="var(--ink)" stroke-dasharray="2 2"/>`;
    s+=`<circle cx="${x}" cy="90" r="3.5" fill="var(--ink)"/>`;
    s+=`<text x="${x}" y="${y}" font-size="11" text-anchor="middle" fill="var(--ink)">${lab}</text>`;
  });
  const cx=Math.min(X(km),x1), color=ITEMS.find(i=>i.id===state.item).kind==="loss"?"var(--loss)":"var(--gain)";
  s+=`<rect x="${x0}" y="86" width="${Math.max(0,cx-x0)}" height="8" fill="${color}" opacity=".85"/>`;
  s+=`<path d="M${cx} 80 l-7 -12 h14 z" fill="${color}"/>`;
  const anchor = cx>x1-80?"end":cx<x0+80?"start":"middle";
  s+=`<text x="${cx}" y="22" font-size="12" font-weight="600" text-anchor="${anchor}" fill="${color}">${t("youAreHere")}: ${big(km)} km</text>`;
  s+=`<line x1="${cx}" y1="28" x2="${cx}" y2="66" stroke="${color}"/>`;
  svg.innerHTML=s;
  svg.setAttribute("aria-label",`${t("youAreHere")}: ${big(km)} km`);
}
function sup(n){return String(n).split("").map(d=>"⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).join("")}

function renderSources(){
  const de=state.lang==="de";
  const src=[
    ["ADAC-Wochenschnitt Super E10: 2,267 € (23.09.2026, via ad-hoc-news)","https://www.ad-hoc-news.de/wirtschaft/super-e10-wird-im-bundesweiten-wochenschnitt-guenstiger-waehrend-diesel/70165509"],
    ["BDEW-Strompreisanalyse 2026 (Haushalte: 37,0 ct/kWh)","https://www.bdew.de/service/daten-und-grafiken/bdew-strompreisanalyse/"],
    ["BBSR: Angebotsmieten 2025 nach Kreistypen","https://www.bbsr.bund.de/BBSR/DE/startseite/topmeldungen/entwicklung-wohnungsmieten-2025.html"],
    ["WG-Zimmer-Preise (Moses Mendelssohn Institut, via Studis Online)","https://www.studis-online.de/studienkosten/wg-zimmer-mietspiegel.php"],
    ["BMF: Personalkostensätze 2025 (Polizei, Lehrkräfte)","https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Oeffentliche_Finanzen/Bundeshaushalt/personalkosten-sachkosten.html"],
    ["Bauarbeiter-Verdienst laut Destatis-Schätzmodell (bau.bi)","https://bau.bi/baumagazin/wirtschaft-politik/gehaelter-was-bau-fachkraefte-wirklich-verdienen-b21292"],
    ["SOKA-BAU: Beiträge der Bauwirtschaft","https://api.soka-bau.de/fileadmin/Dokumente/aktiv-fuer-die-bauwirtschaft.pdf"],
    ["Mehrwertsteuer: Belastung nach Einkommen (DATEV Magazin)","https://www.datev-magazin.de/nachrichten-steuern-recht/wirtschaft/mehrwertsteuererhoehung-belastet-aermere-familien-und-die-konjunktur-auch-bei-gleichzeitiger-reduzierung-fuer-grundbedarf-145994"],
    ["Berlin: Blickpunkt Schule 2024/25","https://www.berlin.de/sen/bildung/schule/bildungsstatistik/blickpunkt-schule-2024_25.pdf"],
    ["Schulzahlen Hamburg, Köln, Leipzig, Frankfurt (findeschule.de)","https://findeschule.de/werkzeuge/schulranking/"],
    ["BMF: Steuerschätzung Oktober 2025 (Steuereinnahmen 2025: rund 991 Mrd. €)","https://www.bundesfinanzministerium.de/Monatsberichte/Ausgabe/2025/11/Inhalte/Kapitel-2-Analysen/2-1-steuerschaetzung-oktober-2025.html?nn=237786"],
    ["Deutsche Rentenversicherung: Finanzen 2025","https://www.deutsche-rentenversicherung.de/DRV/DE/Ueber-uns-und-Presse/Presse/Pressemitteilungen/Pressemitteilungen-archiv/2025/2025-12-10-bvv-gunkel"],
    ["Bundestag hib 619/2026: Rentenzahlbeträge 2025","https://www.bundestag.de/presse/hib/kurzmeldungen-1201366"],
    ["Bundesagentur für Arbeit: Bilanz der Familienkasse 2025 (Kindergeld 55,3 Mrd. €)","https://www.arbeitsagentur.de/presse/2026-04-familien-im-blick-die-bilanz-der-familienkasse-2025"],
    ["Destatis: BAföG 2025","https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/08/PD26_274_214.html"],
    ["Bürgergeld-Zahlungen steigen auf 47 Mrd. € (Schwäbische)","https://www.schwaebische.de/politik/buergergeld-zahlungen-steigen-auf-47-milliarden-euro-3810611"],
    ["Bundesbank: Vermögensbefragung 2023 (Median 103.200 €)","https://www.bundesbank.de/de/aufgaben/themen/bundesbank-studie-vermoegen-in-deutschland-steigen-nominal-gehen-aber-real-zurueck-ungleichheit-bleibt-unveraendert-954622"],
    ["DIW: Reformmodelle zur Erbschaftsteuer","https://www.diw.de/documents/dokumentenarchiv/%2017/67142/diw_sp0052.pdf"],
    ["IW: Überzogene Erwartungen an die Erbschaftsteuer","https://www.iwd.de/pdf/ueberzogene-erwartungen-an-erbschaftsteuer-525319/"],
    ["Deutschlandticket: Nutzerzahlen laut VDV (Berliner Zeitung)","https://www.berliner-zeitung.de/article/deutschlandticket-so-wirkt-sich-der-preisanstieg-auf-die-abonnentenzahl-an-2294356"],
    ["ImmoScout24 WohnBarometer Q3 2025 (Mieten)","https://www.scout24.com/fileadmin/user_upload/ImmoScout24_WohnBarometer_Q3_2025_Miete.pdf"],
    ["Lohnsteuer 2026, Steuerklasse I (nettocalc, 50.000 € brutto)","https://nettocalc.com/de/brutto-netto/jaehrlich/50000"],
    ["Statistik München: allgemeinbildende Schulen","https://stadt.muenchen.de/infos/statistik-bildung.html"],
    ["Hessen: Personalkosten verbeamteter Lehrkräfte","https://kleineanfragen.de/hessen/19/3120-personalkosten-fuer-verbeamtete-und-angestellte-lehrkraefte.pdf"],
    ["Bundestag-Drucksache 17/2787 (Eurofighter-Betriebskosten)","https://dserver.bundestag.de/btd/17/027/1702787.pdf"],
    ["Döner-Preise 2025 (Tageskarte)","https://www.tageskarte.io/gastronomie/detail/wo-es-die-guenstigsten-doener-gibt.html"],
    ["Finanzwende: Die zehn wichtigsten Steuerprivilegien","https://www.finanzwende.de/themen/steuergerechtigkeit/die-zehn-wichtigsten-steuerprivilegien-und-die-80-milliarden-euro"],
    ["ifo: Bundeszuschuss zur Rentenversicherung","https://www.ifo.de/en/press-release/2025-11-18/pension-insurance-subsidy-germany-will-swallow-third-tax-revenues"],
    ["IW Köln: Ein zusätzlicher Arbeitstag","https://www.iwkoeln.de/presse/iw-nachrichten/christoph-schroeder-ein-zusaetzlicher-arbeits"],
    ["Deutschlandticket: Finanzierung 2026 (mobiflip)","https://www.mobiflip.de/deutschlandticket-gesetzesentwurf-zur-finanzierung-2026/"],
    ["Deutschlandticket wird 2026 teurer (Finanztip)","https://finanztip.de/daily/deutschlandticket-wird-2026-teurer-preis-steht-fest/"],
    ["Schätzungen zum Cum-Ex-Schaden (Statista)","https://de.statista.com/infografik/26036/geschaetzter-steuerverlust-durch-cum-cum-und-cum-ex"],
    ["Cum-Ex-Untersuchungsausschuss, Prof. Spengel (Uni Mannheim)","https://www.bwl.uni-mannheim.de/news/untersuchungsausschuss-zum-cum-ex-finanzskandal/"],
    ["Streit um Gorch-Fock-Kosten (LTO)","https://www.lto.de/recht/nachrichten/n/lg-bremen-streit-kosten-gorch-fock-vergleich-vorschlag-bund-werft"],
    ["7 % Mehrwertsteuer für die Gastronomie beschlossen (Hogapage)","https://www.hogapage.de/nachrichten/politik/branchenpolitik/7-mehrwertsteuer-f%C3%BCr-die-gastronomie-beschlossen/"],
    ["Umweltbundesamt: Pauschale Dienstwagenbesteuerung","https://www.umweltbundesamt.de/themen/steuer-umweltwirkungen-der-pauschalen"],
    ["5 Mrd. € jährlich für die Mütterrente III (familie.de)","https://www.familie.de/familienleben/5-milliarden-jaehrlich-fuer-die-neue-muetterrente-teures-steuergeschenk-oder-laengst-ueberfaellig--01JPAR8SZ286T60FTEX182491H"],
    ["Wissenschaftlicher Dienst des Bundestags zur Steuerhinterziehung","https://www.bundestag.de/resource/blob/535300/c59a2798fc5dfec648c356f201206cef/WD-4-096-17-pdf.pdf"],
    ["Bundesrechnungshof zu Spahns Masken (ZDFheute)","https://www.zdfheute.de/politik/deutschland/corona-masken-bericht-bundesrechnungshof-spahn-100.html"],
    ["517 Mio. € Folgekosten wegen Maskenkäufen (Stuttgarter Zeitung)","https://www.stuttgarter-zeitung.de/politik/haelfte-der-masken-nicht-verwendet-517-millionen-euro-an-folgekosten-wegen-maskenkaeufen-79144186.html"],
    ["Folgekosten nach Maskenkäufen (Ärzteblatt)","https://www.aerzteblatt.de/themen/prozesse-skandale/weiter-folgekosten-in-millionenhohe-nach-maskenkaufen-876446cd-d5e3-4add-bb38-23fb583c0d3d"],
    ["Gescheiterte Pkw-Maut kostet weitere Millionen (beck-aktuell, 2025)","https://www.beck-aktuell.de/heute-im-recht/rechtspolitik-gesetzgebung/gescheiterte-pkw-maut-kosten-steuerzahler-millionen-2025-09-04"],
    ["Keine Klage gegen Scheuer (t-online)","https://www.t-online.de/nachrichten/deutschland/id_100310228/pkw-maut-bund-klagt-nicht-gegen-ex-verkehrsminister-scheuer.html"],
    ["DIW Wochenbericht 4/2016: Aufkommenspotential der Vermögensteuer","https://www.diw.de/de/diw_01.c.525353.de/publikationen/wochenberichte/2016_04_1/hohes_aufkommenspotential_bei_wiedererhebung_der_vermoegensteuer.html"],
    ["Rosa-Luxemburg-Stiftung / DIW: Vermögensteuer-Konzept der Linken","https://www.rosalux.de/publikation/id/54422/vermoegensteuer-die-linke"],
    ["Rödl & Partner: Weg zu einer neuen Vermögensteuer (2026)","https://www.roedl.com/insights/deutschland-weg-neuen-vermoegensteuer/"],
    ["Milliarden geerbt, kaum Steuern gezahlt (web.de, Destatis-Daten 2024)","https://web.de/magazine/politik/inland/milliarden-geerbt-steuern-gezahlt-41732730"],
    ["DIHK für Beibehaltung der Verschonungsregeln","https://www.dihk.de/de/newsroom/erbschaftsteuer-dihk-plaediert-fuer-beibehaltung-der-verschonungsregelungen-fuer-betriebsvermoegen-178732"]
  ];
  const method = de
    ? "Methode: Einmalige Schäden werden als Gesamtbetrag gezeigt, Steuereinnahmen als Jahresbetrag mal gewähltem Zeitraum (ohne Inflation, Wachstum oder Verhaltensänderungen). Schule = nur Baukosten; laufende Personalkosten stehen getrennt (Kollegium einer Schule pro Jahr). Tankfüllung = Tankgröße × Literpreis, Reichweite aus dem Verbrauch. Einwohnerzahl 83,6 Mio. (Destatis). Alle Vergleichswerte sind Annahmen und oben änderbar. Stand: Oktober 2026."
    : "Method: one-off damages are shown as a total; tax revenue is the annual figure times the chosen period (no inflation, growth or behavioural effects). School = construction only; running staff costs are shown separately (a school's staff per year). Tank = tank size × price per litre, range from consumption. Population 83.6 m (Destatis). All comparison values are assumptions you can change above. As of October 2026.";
  $("sources").innerHTML = `<p>${method}</p>` + src.map(([n,u])=>`<a href="${u}" target="_blank" rel="noopener">${n}</a>`).join("");
}

document.addEventListener("click",e=>{
  if(e.target.closest(".pform")) return;
  const ed=e.target.closest(".pedit"); if(ed){ e.stopPropagation(); openPriceEdit(ed.dataset.edit); return; }
  const tl=e.target.closest(".tile[data-key]"); if(tl) busy(()=>toggleSel(tl.dataset.key));});
document.addEventListener("keydown",e=>{ if(e.target.closest(".pform,.pedit")) return; const tl=e.target.closest(".tile[data-key]"); if(tl&&(e.key==="Enter"||e.key===" ")){e.preventDefault();toggleSel(tl.dataset.key);}});
(function(){
  // Show the bar as soon as the estimate/years controls have scrolled out above the viewport (also right on load when the page opens scrolled down).
  const bar=$("stickybar"), set=on=>{bar.classList.toggle("show",on); bar.setAttribute("aria-hidden",!on); bar.inert=!on;};
  const anchor=$("controls"), past=()=>anchor.getBoundingClientRect().bottom<0, check=()=>set(past());
  set(false); check();
  if("IntersectionObserver" in window) new IntersectionObserver(check).observe(anchor);
  addEventListener("scroll",()=>{ if(bar.classList.contains("show")!==past()) check(); },{passive:true});
  addEventListener("load",check);
  $("sb-select").onchange=e=>busy(()=>selectItem(e.target.value));
})();
$("pick-q").oninput=e=>{ state.pq=e.target.value; renderStatic(); };
$("pick-area").onchange=e=>{ state.parea=e.target.value; renderStatic(); };
$("top-more").onclick=()=>busy(()=>{ topMore=!topMore; render(); });
document.addEventListener("change",e=>{
  const el=e.target.closest(".inl"); if(!el) return; const v=parseNum(el.value); if(!(v>0)) { render(); return; }
  if(el.dataset.a){ A[el.dataset.a]=v; A_EDIT[el.dataset.a]=true; }
  else if(el.dataset.p){ const u=Object.values(UNITS).flat().find(x=>x.n&&x.n.de===el.dataset.p); if(u){ if(Math.abs(v-defaultBase(u))>0.005) PRICE_OV[u.n.de]=v; else delete PRICE_OV[u.n.de]; } }
  busy(()=>{ resetSel(); saveState(); renderStatic(); render(); });
});
document.addEventListener("keydown",e=>{ const el=e.target.closest&&e.target.closest(".inl"); if(el&&e.key==="Enter"){ e.preventDefault(); el.blur(); } });
$("a-reset").onclick=()=>busy(()=>{ Object.assign(A,A_DEF); A_EDIT={}; applyProfile(); resetSel(); saveState(); renderStatic(); render(); });
$("p-reset").onclick=()=>busy(()=>{ PRICE_OV={}; resetSel(); saveState(); renderStatic(); render(); });
$("prof-done").onclick=()=>{ PROFILE._closed=true; saveProfile(); renderProfile(); };
$("prof-edit").onclick=()=>{ PROFILE._closed=false; saveProfile(); renderProfile(); $("qs").querySelector("button")?.focus(); };
$("prof-reset").onclick=()=>{ PROFILE={}; saveProfile(); applyProfile(); resetSel(); renderStatic(); render(); };
$("sel-clear").onclick=()=>busy(()=>{state.sel=[];selBeforeAll=null;render();});
$("dots").addEventListener("click",e=>{const g=e.target.closest(".rm")&&e.target.closest("[data-unsel]"); if(g){state.sel=state.sel.filter(k=>k!==g.dataset.unsel); render();}});
$("dots").addEventListener("keydown",e=>{const g=e.target.closest("[data-unsel]"); if(g&&(e.key==="Enter"||e.key===" "||e.key==="Delete"||e.key==="Backspace")){e.preventDefault(); state.sel=state.sel.filter(k=>k!==g.dataset.unsel); render();}});
$("sel-all").onclick=()=>{ const all=allUnitKeys();
  if(all.every(k=>state.sel.includes(k))){ state.sel=selBeforeAll||griffigSel(amount()); selBeforeAll=null; }
  else { selBeforeAll=state.sel.slice(); state.sel=all; }
  render(); };
$("prev").onclick=()=>goSlide(slide-1);
$("next").onclick=()=>goSlide(slide+1);
let st; $("panels").addEventListener("scroll",()=>{clearTimeout(st);st=setTimeout(()=>{const P=$("panels");slide=Math.round(P.scrollLeft/(P.clientWidth+16));markSlide();},80);});
$("lang-de").onclick=()=>busy(()=>{state.lang="de";renderStatic();render();});
$("lang-en").onclick=()=>busy(()=>{state.lang="en";renderStatic();render();});
for(const id of ["years","sb-years"]) $(id).oninput=e=>{state.years=+e.target.value; resetSel(); renderSoon();};
for(const id of ["custom","sb-custom"]) $(id).oninput=e=>{const v=parseFloat(e.target.value); if(v>=0){state.custom=v; resetSel(); renderSoon();}};
// Restore the last session (topic, estimate, years, own amount, language, comparison, slide, assumptions); a #topic link still wins.
const saved=loadState();
if(saved){
  if(I18N[saved.lang]) state.lang=saved.lang;
  if(ITEMS.some(i=>i.id===saved.item)) state.item=saved.item;
  if(["low","mid","high"].includes(saved.scen)) state.scen=saved.scen;
  if(saved.years>=1&&saved.years<=10) state.years=saved.years;
  if(saved.custom>=0) state.custom=saved.custom;
  if(saved.aedit&&typeof saved.aedit==='object') A_EDIT=saved.aedit;
  if(saved.A && saved.av===2) for(const k of Object.keys(A_EDIT)) if(k in A && saved.A[k]>0) A[k]=saved.A[k];
  if(saved.prices&&typeof saved.prices==='object') PRICE_OV=saved.prices;
}
const h=(location.hash||"").slice(1); const hashItem=ITEMS.some(i=>i.id===h)&&h!==(saved&&saved.item); if(ITEMS.some(i=>i.id===h)) state.item=h;
applyProfile();
state.sel = saved&&Array.isArray(saved.sel)&&!hashItem ? saved.sel.filter(k=>{const [u,i]=String(k).split(":"); return UNITS[u]&&UNITS[u][+i];}) : griffigSel(amount());
renderStatic(); render();
if(saved&&saved.slide>0) goSlide(saved.slide); else markSlide();
restoring=false; saveState();
addEventListener("resize",fitHeight);