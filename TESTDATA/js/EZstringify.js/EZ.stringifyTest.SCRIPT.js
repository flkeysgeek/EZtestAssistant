/*--------------------------------------------------------------------------------------------------
Dreamweaver LINT global references and definitions  not used here
--------------------------------------------------------------------------------------------------*/
/*global
EZ, DWfile,

e:true, g:true, dw:true, f:true
*/
var e;			//global var for try/catch
(function() {[	//global variables and functions defined but not used

e, f, g, dw, DWfile ]});
//__________________________________________________________________________________________________
EZ.stringifyTest.test = function()
{
	EZ.test.run({a:1, b:2})

	var x = {a:1};
	x.b = x;

 	//setnote('Circular Object')
	EZ.test.run(x)
	EZ.test.run(x, '*');
	EZ.test.run(x, '*circular');
}
