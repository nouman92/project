//===================================================================================================================================
    var code="";												// code from client

	var Tokens = new Array();							//list of token genrated from code

	var counter=0;

	var curr="";

	var EOF = -1;

	var output="";							// code to be shown as results to users



	var error=0;

    var c_T="";
    var c_t_v="";

	var TokenBuffer = new Array();		// token buffer for syntax analyzer


//=====================================================================================================================================
  $(document).ready(function(){ // waites for complete load of page
  $("#Submit").click(function(){ // listens button click
	  debugger;
	  code=$("#code").val();

	 Lexeme();
	  syntax();
	  if( error == 1)
	  {
		  var x = output + "======================================\n\t\tSyntax Error"
		  output=x;
	  }
      $("#output").html(output);
	  counter=0;
	  curr= "";
	  EOF = -1;
	  output="";
	  error=0;
	  Tokens = new Array();
	  TokenBuffer = new Array();
  });
});

function Lexeme()
{

	read();


	while (curr != EOF)
	{
	            nextToken()	// returns a valid token
	}



	var t=1;
	while(Tokens.length > 0)
	{
		var obj=Tokens.pop();
		for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            output += p + '::' + obj[p] + "\n";
			if( t ==1)
			 {
			   TokenBuffer.push(obj);
			   t=0;
			 }
			 else if(t==0 )
			 {
			   t=1;
			 }

        }
    }

	}
}
//reads 1 chracter at a time in curr variable from code
   function read() {
		if(code.length + 1 == counter)
				curr=EOF;
		else
		{
			curr=code.charAt(counter);
		    counter++;
		}
	}

	function  isNumeric(c)
	{
		if (c >= '0' && c <= '9')
		{
			return true;
		}
		else
		    return false;
	}

	function isAlpha( c) {
		if (c >= 'a' && c <= 'z') {
			return true;
		}
		else if (c >= 'A' && c <= 'Z') {
			return true;
		}
		else
			return false;
	}

	function nextToken() {

		var state = 1; // Initial state

		var numBuffer = 0;
		var alphaBuffer = "";
		var decBuffer = 0;

		var lex=false;			// if curent lexem is a valid token

		while (true) {

			if (curr == EOF || lex  )
			{
				break;

			}
			switch (state) {
			case 1:
				switch (curr) {
				case ' ':
				case '':
				case '\f':
				case '\n':
				case '\b':
				case '\r':
				case '\t':
					read();
					break;
				case '+':
					read();
					var token= { "Type" : "OP" , "lexem" : "+" };
					Tokens.push(token);
					lex = true;
					break;
				case '-':
				    read();
					var token= { "Type" : "OP" , "lexem" : "-" };
					Tokens.push(token);
					lex = true;
					break;
				case '*':
				    read();
					var token= { "Type" : "OP" , "lexem" : "*" };
					Tokens.push(token);
					lex = true;
					break;
				case '%':
					read();
					var token= { "Type" : "OP" , "lexem" : "%" };
					Tokens.push(token);
					lex = true;
					break;
				case '/':
					read();
					var token= { "Type" : "OP" , "lexem" : "/" };
					Tokens.push(token);
					lex = true;
					break;
				case ';':
					read();
					var token= { "Type" : "PM" , "lexem" : ";" };
					Tokens.push(token);
					lex = true;
					break;
				case '(':
					read();
					var token= { "Type" : "PM" , "lexem" : "(" };
					Tokens.push(token);
					lex = true;
					break;
				case ')':
					read();
					var token= { "Type" : "PM" , "lexem" : ")" };
					Tokens.push(token);
					lex = true;
					break;
				case '{':
					read();
					var token= { "Type" : "PM" , "lexem" : "{" };
					Tokens.push(token);
					lex = true;
					break;
				case '}':
					read();
					var token= { "Type" : "PM" , "lexem" : "}" };
					Tokens.push(token);
					lex = true;
					break;

				case '=':
					read();
					state = 8;
					break;

				case '!':
					read();
					state = 9;
					break;
				case '&':
					read();
					state = 10;
					break;
				case '|':
					read();
					state = 11;
					break;
				case '<':
					read();
					state = 14;
					break;
				case '>':
					read();
					state = 15;
					break;
				case '"':
					read();
					state = 13;
					alphaBuffer = "";
					break;

				default:
					state = 2;
					break;
				}
                break;

			case 2:
				if (isNumeric(curr)) {
					numBuffer = 0;
					numBuffer += (curr - '0');
					state = 3;
					read();
				} else {
					state = 5;
				}
				break;
			case 3:
				if (isNumeric(curr)) {
					numBuffer *= 10;
					numBuffer += (curr - '0');
					read();
				} else if (curr == '.') {
					read();
					state = 4;
				} else {
					var token= { "Type" : "NM" , "lexem" : numBuffer };
					Tokens.push(token);
					lex = true;state = 1;
				}
				break;
		   case 4:
				if (isNumeric(curr)) {
					decBuffer = 0;
					decBuffer += (curr - '0');
					state = 7;
					read();
				} else {
					$("#output").html("inavlid input "+numBuffer+".");
					exit;
					var token= { "Type" : "Error" , "lexem" : "inavlid input "+numBuffer+"." };
					Tokens.push(token);
					lex = true;state = 1;
				}
				break;
			case 7:
				if (isNumeric(curr)) {
					decBuffer *= 10;
					decBuffer += (curr - '0');
					read();
				} else {
					var token= { "Type" : "NM" , "lexem" : numBuffer+"."+decBuffer };
					Tokens.push(token);
					lex = true;state = 1;
				}
				break;
			case 5:
				if (isAlpha(curr) || curr == '_') {
					alphaBuffer = "";
					alphaBuffer += curr;
					state = 6;
					read();
				} else {
					alphaBuffer = "";
					alphaBuffer += curr;
					read();
					$("#output").html("inavlid input \""+alphaBuffer+"\".");
					exit;
					var token= { "Type" : "Error" , "lexem" : "inavlid input "+alphaBuffer};
					Tokens.push(token);
					lex = true;state = 1;
				}
				break;

			case 6:
				if ((isAlpha(curr) || isNumeric(curr) || curr == '_')) {
					alphaBuffer += curr;
					read();
				} else
				{
					if ( alphaBuffer == "else"
							|| alphaBuffer == "if"
							|| alphaBuffer == "return"
							|| alphaBuffer == "while"
							|| alphaBuffer == "print"
							|| alphaBuffer == "scan"
							|| alphaBuffer == "true"
							|| alphaBuffer == "false"
							|| alphaBuffer == "fi"
							|| alphaBuffer == "done"  ) {
					var token= { "Type" : "KW" , "lexem" : alphaBuffer };
					Tokens.push(token);
					lex = true;state = 1;
					}
					else
					{
                    var token= { "Type" : "ID" , "lexem" : alphaBuffer };
					Tokens.push(token);
					lex = true;state = 1;
					}
				}
				break;
			case 8:
				if (curr == '=') {
					read();
					var token= { "Type" : "OP" , "lexem" : "==" };
					Tokens.push(token);
					lex = true;state = 1;
				} else {
                    var token= { "Type" : "OP" , "lexem" : "=" };
					Tokens.push(token);
					lex = true;
					state = 1;
				}
				break;
			case 9:
				if (curr == '=') {
					read();
					var token= { "Type" : "OP" , "lexem" : "!=" };
					Tokens.push(token);
					lex = true;state = 1;
				}
			     else {
					$("#output").html("inavlid input \""+curr+"\".");
					exit;
					var token= { "Type" : "Error" , "lexem" : "inavlid input !"};
					Tokens.push(token);
					lex = true;state = 1;
				}
                 break;
			case 10:
				if (curr == '&') {
					read();
					var token= { "Type" : "OP" , "lexem" : "&&" };
					Tokens.push(token);
					lex = true;state = 1;
				} else {
					$("#output").html("inavlid input \""+curr+"\".");
					exit;
					var token= { "Type" : "Error" , "lexem" : "inavlid input &"};
					Tokens.push(token);
					lex = true;state = 1;
			    }
				break;
			case 11:
				if (curr == '|') {
					read();
					var token= { "Type" : "OP" , "lexem" : "||" };
					Tokens.push(token);
					lex = true;state = 1;
				} else {
					$("#output").html("inavlid input \""+curr+"\".");
					exit;
					var token= { "Type" : "Error" , "lexem" : "inavlid input |"};
					Tokens.push(token);
					lex = true;state = 1;
				}
				break;

			case 13:
				if (curr == '"') {
					read();
					var token= { "Type" : "ST" , "lexem" : "\"" + alphaBuffer+"\"" };
					Tokens.push(token);
					lex = true;state = 1;

				} else if (curr == '\n' || curr == EOF) {
					read();
					$("#output").html("inavlid input \""+alphaBuffer+"\".");
					exit;
					var token= { "Type" : "Error" , "lexem" : "inavlid string literal"};
					Tokens.push(token);
					lex = true;state = 1;
				} else {
					alphaBuffer += curr;
					read();
				}
				break;
            case 14:
				if (curr == '=') {
					read();
					var token= { "Type" : "OP" , "lexem" : "<=" };
					Tokens.push(token);
					lex = true;state = 1;
				} else {
                    var token= { "Type" : "OP" , "lexem" : "<" };
					Tokens.push(token);
					lex = true;state = 1;
				}
				break;
			case 15:
				if (curr == '=') {
					read();
					var token= { "Type" : "OP" , "lexem" : ">=" };
					Tokens.push(token);
					lex = true;state = 1;
				} else {
                    var token= { "Type" : "OP" , "lexem" : ">" };
					Tokens.push(token);
					lex = true;state = 1;
				}
				break;
			}
	}
}

//===============================================================================================

function syntax(){
	GetNextToken();
	if(c_T == "ID")
	{
		GetNextToken();
		if(c_t_v == '=')
		{
			GetNextToken();
			if(c_T != "")
			{
				Assignment();
			}
			else
			  error=1;
		}
		else
		 error=1;
	}
	else if (c_T == "KW")
	{
		switch(c_t_v)
		{
			case 'while':
				whileloop();
				break;
			case 'if':
				 conditional();
				 break;
		    case 'print':
				 printstatement();
				 break;
		    case 'scan':
				 scanstatement();
				 break;
			case 'fi':
				break;
			case 'done':
			    break;
		    default :
				break;
		}
	}
	else
	 error=1;
}

function GetNextToken(){
	var obj = TokenBuffer.pop();
	if (obj == null)
	{
		c_T="";
		c_t_v="";
		return;
	}
	var f=0;
	for (var p in obj) {
		if(f == 0)
		{
		  c_T=obj[p] ;
		  f = 1;
		}
		else
		{
			c_t_v=obj[p] ;
		}
	}
}
function F(){
	switch (c_T){
		case  "NM":
			GetNextToken();
			break;
		case  "ID":
			GetNextToken();
			break;
		default:
			error=1;
		}
}
function T_(){
	if (c_T ==  "OP" ){
		GetNextToken();
		F();
		T_();
	}
}

function T(){
	F();
	T_();
}

function Assignment(){
	T();
}

function whileloop()
{
	GetNextToken();
	if( c_T == "ID")
	{
			GetNextToken();
			if( c_t_v == "==" || c_t_v == "!=" || c_t_v == ">=" || c_t_v == "<=" || c_t_v == ">" || c_t_v == "<")
			{
				GetNextToken();
				if( c_T == "NM")
				{
					syntax();
					while( c_t_v != "done")
					{
						syntax();
						if( c_T == "")
						{
							error=1;
							break;
						}
					}
				}
				else
				  error=1;
			}
			else
				  error=1;
	}
	else
	   error=1;
}

function conditional()
{
	GetNextToken();
	if( c_T == "ID")
	{
			GetNextToken();
			if( c_t_v == "==" || c_t_v == "!=" || c_t_v == ">=" || c_t_v == "<=" || c_t_v == ">" || c_t_v == "<")
			{
				GetNextToken();
				if( c_T == "NM")
				{
					syntax();
					while( c_t_v != "fi")
					{
						syntax();
						if( c_T == "")
						{
							error=1;
							break;
						}
					}
				}
				else
				  error=1;
			}
			else
				  error=1;
	}
	else
	   error=1;
}
function printstatement()
{
	GetNextToken();
	if( c_T == "ST")
	{
			$("#output").html(c_t_v);
					exit;
	}
	else
	  error=1;
}
function scanstatement()
{
	GetNextToken();
	if( c_T == "ID")
	{
		//actions
	}
	else
	  error=1;
}