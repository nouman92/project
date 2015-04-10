    var code;
	var Tokens = new Array();
	var counter=0;
	var curr; // The current character being scanned
	var EOF = -1;	// End of file character
	var output;
	
	
	var erro=0;
    var c_T;
    var c_t_v;
	var TokenBuffer = new Array();
	
  $(document).ready(function(){
  $("#Submit").click(function(){
	  code=document.form.code.value ;
	  console.log(code.length);
	  debugger;
	  Lexeme();
	  main();
	  $("#show").html(output);
	  counter=0;
	  curr= "";
	  EOF = -1;
	  output="";
	  erro=0;
	  Tokens = new Array();
	  TokenBuffer = new Array();
  });
});
	
function Lexeme()
{
	
	read();
	while (curr != EOF)
	{
	            nextToken()
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
	 function read() {
		if(code.length+1 == counter)
				curr=EOF;
		else
		{
			curr=code.charAt(counter);
			console.log(curr);
		    counter++;
		}
	}

	// Checks if a character is a digit
	function  isNumeric(c) 
	{
		if (c >= '0' && c <= '9') 
		{
			return true;
		}

		return false;
	}

	function isAlpha( c) {
		if (c >= 'a' && c <= 'z') {
			return true;
		}
		if (c >= 'A' && c <= 'Z') {
			return true;
		}

		return false;

	}

	function nextToken() {

		var state = 1; // Initial state
		
		var numBuffer = 0; 
		var alphaBuffer = "";
		var decBuffer = 0;
		var lex=false;		
		while (true) {
	        
			if (curr == EOF || lex  ) 
			{
				break;

			} 
			switch (state) {
			case 1:
				switch (curr) {
				case ' ': 
				case '\f': 
				case '\s': 
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
					state = 1;
					break;
				case '-':
					var token= { "Type" : "OP" , "lexem" : "-" };
					Tokens.push(token);
					lex = true;
					state = 1;
					break;
				case '*':
					var token= { "Type" : "OP" , "lexem" : "*" };
					Tokens.push(token);
					lex = true;state = 1;
					break;
				case '%':
					read();
					var token= { "Type" : "OP" , "lexem" : "%" };
					Tokens.push(token);
					lex = true;state = 1;
					break;	
				case ';':
					read();
					var token= { "Type" : "PM" , "lexem" : ";" };
					Tokens.push(token);
					lex = true;state = 1;
					break;
			
				case '(':
					read();
					var token= { "Type" : "PM" , "lexem" : "(" };
					Tokens.push(token);
					lex = true;state = 1;
					break;
				case ')':
					read();
					var token= { "Type" : "PM" , "lexem" : ")" };
					Tokens.push(token);
					lex = true;state = 1;
					break;
				case '{':
					read();
					var token= { "Type" : "PM" , "lexem" : "(" };
					Tokens.push(token);
					lex = true;state = 1;
					break;
				case '}':
					read();
					var token= { "Type" : "PM" , "lexem" : "}" };
					Tokens.push(token);
					lex = true;state = 1;
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
				case '"':
					read();
					state = 13;
					alphaBuffer = "";
					break;

				default:
					state = 2; // Check the next possibility
					break;
				}
                break;
				// Integer - Start
			case 2:
				if (isNumeric(curr)) {
					numBuffer = 0; // Reset the buffer.
					numBuffer += (curr - '0');

					state = 3;

					read();

				} else {
					state = 5; // doesnot start with number or symbol go to case
					// 5
				}
				break;

				// Integer - Body
			case 3:
				if (isNumeric(curr)) {
					numBuffer *= 10;
					numBuffer += (curr - '0');

					read();

				} else if (curr == '.') {

					read();

					state = 4; // has decimal point go to case 4

				} else {
					var token= { "Type" : "NM" , "lexem" : numBuffer };
					Tokens.push(token);
					lex = true;state = 1;
				}

				break;

				// decimal-start
			case 4:
				if (isNumeric(curr)) {
					decBuffer = 0;
					decBuffer += (curr - '0');
					state = 7;
					read();

				} else {
					var token= { "Type" : "Error" , "lexem" : "inavlid input"+numBuffer+"." };
					Tokens.push(token);
					lex = true;state = 1;
				}
				break;
				// decimal body
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

				// identifier -start
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
					var token= { "Type" : "Error" , "lexem" : "inavlid input"+alphaBuffer};
					Tokens.push(token);
					lex = true;state = 1;
				}
				break;

				// identifier - Body
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
							|| alphaBuffer == "true"
							|| alphaBuffer == "false"  ) {
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

				// if ==
			case 8:
				if (curr == '=') {
					read();
					var token= { "Type" : "OP" , "lexem" : "==" };
					Tokens.push(token);
					lex = true;state = 1;
				} else {
                    var token= { "Type" : "OP" , "lexem" : "=" };
					Tokens.push(token);
					lex = true;state = 1;
				}
				break;
				// if !=
			case 9:
				if (curr == '=') {
					read();
					var token= { "Type" : "OP" , "lexem" : "!=" };
					Tokens.push(token);
					lex = true;state = 1;
				}
			     else {
					var token= { "Type" : "Error" , "lexem" : "inavlid input !"};
					Tokens.push(token); 
					lex = true;state = 1;
				}
                 break;
				// if &&
			case 10:
				if (curr == '&') {
					read();
					var token= { "Type" : "OP" , "lexem" : "&&" };
					Tokens.push(token);
					lex = true;state = 1;
				} else {
					var token= { "Type" : "Error" , "lexem" : "inavlid input &"};
					Tokens.push(token);
					lex = true;state = 1;
			    }
				break;
				// if ||
			case 11:
				if (curr == '|') {
					read();
					var token= { "Type" : "OP" , "lexem" : "||" };
					Tokens.push(token);
					lex = true;state = 1;
				} else {
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
					var token= { "Type" : "Error" , "lexem" : "inavlid string literal"};
					Tokens.push(token);
					lex = true;state = 1;
				} else {
					alphaBuffer += curr;
					read();
				}
				break;
				// alphaBuffer += curr;
				// curr = read();

			}
	}
	}
	
	//===============================================================================================
	
	
	

function main(){ 
GetNextToken();
	if(c_T == "ID")
	{
		GetNextToken();
		if(c_t_v == '=')
		{
			GetNextToken();
			E(); 
			if(erro == 0)
			{
			  var x = output + " ================================================== \n Syntax Correct :: syntax is correct \n "  ;
			  output=x;
			}
			else
			{
				 var x = output + " ================================================== \n Syntax Error :: syntax is Not scorrect \n "  ;
				 output=x;
			}
		}
		else
		{
			 var x = output + " ================================================== \n Syntax Error :: syntax is Not scorrect \n "  ;
			 output=x;
		}
	}else if(c_T == "KW")
		{
			 switch(c_t_v)
			 {
				 case 'while':
				 case 'if':
				 case 'else':
			 }
		 }
} 

function GetNextToken(){ 
var obj = TokenBuffer.pop();
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

case "PM": 

GetNextToken(); 

E(); 

if (c_T ==  "PM") 

GetNextToken(); 

break; 

case  "NM": 

GetNextToken(); 

break; 

case  "NM": 

GetNextToken(); 

break; 

default: 

erro=1;

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

function E_(){ 

switch (c_T){ 

case  "OP":

GetNextToken(); 

T(); 

E_(); 

break; 

case "OP":

GetNextToken(); 

GetNextToken(); 

T(); 

E_(); 

break; 

default: 

break; 

} 

} 

function E(){ 

T(); 

E_(); 

} 


