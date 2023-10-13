# jSlang
### Probably one of the worst languages you'll ever come across.
It's interpreted in javascript. LOL. It's supposed to be strongly typed, but it really isn't cuz I didn't try that hard. Also nested ifs are janky, so be careful with those I guess. Infinite loops (with output) don't work because javascript won't update dom elements while the script is still running for some reason.
## Syntax
Everything is a function. Every function requires a question mark to signify inputs. Everything requires a semicolon after it. You cannot declare functions. Function inputs are werid and inconsistant, so look in the manual to know how to use them.
## Runtime Function Manual
print: prints a var or string literal. Signify a newline with '\n' (1 input only). This should be done with quotes, but only when using a string literal. 1 argument<br>
variable: declare a string variable. Declare and initialize a variable inside quotes with this syntax: variable?"myString = hello"; This should be done with quotes. 2 arguments seperated with =<br>
variablen: same thing as variable, but with integers. This should be done in quotes. 2 arguments seperated with =<br>
setvar: set a variable to a value. will warn you when you try to set a string to an integer variable. use %GetTime to get the current unix timestamp at runtime. This should be done in quotes. 2 arguments seperated with =<br>
if: perform a conditional statement. Supports use of == operator or < operator. 2 arguments<br>
}: close an if statement. supports the argument 'else' to perform an else operation. (be careful when nesting. ifs don't really work when nested). Either 0 or 1 argument.<br>
add: add a number to the first number. does not yet support adding vars to the original number. Only literals. 2 arguments seperated with +.<br>
clearscreen: clears the terminal text. 0 arguments.<br>
terminalcolor: set the terminal text output color to any css word color. Requires quotes. 1 argument.<br>
input: Create popup box with a label and an input box. 2 arguments seperated with a comma. first requires quotes, second does not.<br>
jump: jump to a label (for label defenition, see preprocess manual). 1 argument. Does not require quotes.<br>
c: Does not do anything, so it is reserved for comments. 1 argument, requires quotes.<br>
end: Stops executing. 0 arguments.<br>
concat: concat a variable or a string literal to another variable. 2 agruments, 2nd argument requires quotes depending on whether or not it's a literal or a variable<br>
flush: does nothing right now, but it is supposed to force refresh the terminal window so you can see output while the program is still running. Again, however, it does not work. 0 arguments.<br>
## Preprocess Manual
### Functions
label: creates a jump label. Call it with the jump function (see runtime function manual for jump definition)<br>
### Directives
Requires @ with a keyword after it.<br>
@GetTime: replaces with current unix timestamp<br>
### General
I did this cuz i'm lazy<br>
true (keyword): gets replaced with the integer literal 1<br>
false (keyword): gets replaced with the integer literal 0<br>
# Closing thoughts
You probably shouldn't waste your time with this lol