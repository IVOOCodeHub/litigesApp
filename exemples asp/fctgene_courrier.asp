<%
' Fonctions générales courrier ===========================================================================================================================================================

function canal_courrier(nc)
	' Retourne la nature du courrier en clair
	select case nc
		case "E"
			canal_courrier="Email"
		case "C"
			canal_courrier="Courrier"
		case "R"
			canal_courrier="Courrier AR"
		case "F"
			canal_courrier="Fax"
		case "M"
			canal_courrier="Mains propres"
		case else
			canal_courrier="?"
	end select
end function

function nature_courrier(nc)
	' Retourne la nature du courrier en clair
	' Depuis le 23/11/2017, la nature du courrier n'est plus codée mais directement enregistrée
	nature_courrier=nc
end function

function code_compta_societe(s)
	' Retourne le code société compta de la société S
	txtsql="SELECT code_compta FROM societes WHERE nomsociete='" & s & "'"
	set datasoc = Server.CreateObject("ADODB.Recordset")
	datasoc.ActiveConnection = dsnemployes
	datasoc.Source = txtsql
	datasoc.Open()
	if datasoc.eof then code_compta_societe="NC" else	code_compta_societe=trim(datasoc("code_compta"))
	datasoc.Close()
end function

%>



