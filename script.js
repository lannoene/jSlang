let display = document.getElementById('output');

// var sections
const VARIABLE	= 0;
const VALUE 	= 1;
const TYPE		= 2;

// var types
const INTEGER	= 0;
const STRING	= 1;
const ARRAY		= 2;

// label sections
const LABELNAME	= 0;
const LABELINDEX= 1;


let labelKey = [[], []];

function run(input) {

	input = run_textreplacement(input);

	labelKey = [[], []];
	let textColor = "black";
	let varKey = [[], [], []];
	let cmdArry = input.split(';');
	cmdArry.pop();
	let cmdInpArry = [];
	let newCmdArry = [];
	console.log(cmdArry);

	cmdArry.forEach((item, index) => {
		if (cmdArry.indexOf('\n') != 0) {
			console.log("newline found");
			item = item.replace('\n', "");
		}
		newCmdArry[index] = item.split('?');
	});
	console.log(newCmdArry);
	let inpOutp = [];
	newCmdArry.forEach((item1, index1) => {
		item1.forEach((item, index) => {
			inpOutp.push(item);
		});
	});
	cmdArry = [];
	for (let i = 0; i < inpOutp.length; i++) {
		console.log(i, inpOutp, inpOutp.length);
		if (i % 2 === 0) {
			cmdArry[i] = inpOutp[i];
			console.log('new command', cmdArry[i]);
		} else {
			cmdInpArry[i - 1] = inpOutp[i];
			console.log('new cmd input', cmdInpArry[i - 1]);
		}
	}

	console.log("running preprocessor...");
	// ---- PREPROCESSOR ----
	run_preprocessor(cmdArry, cmdInpArry);
	// ----------------------
	
	console.log("executing code...");
	for (let index = 0; index < cmdArry.length; index++) {
		if (cmdArry[index] != undefined) {
			cmdArry[index] = cmdArry[index].replace(/\s/g, '');
		}
		switch (cmdArry[index]) {
			case "print":
				if (cmdInpArry[index].search('"') !== -1) {
					let takeAwayQuotes = cmdInpArry[index].split('"');
					takeAwayQuotes.pop();
					takeAwayQuotes.shift();
					terminal_write(takeAwayQuotes[0], textColor);
				} else {
					varKey[VARIABLE].forEach((item2, index2) => {
						if (item2 == cmdInpArry[index]) {
							terminal_write(varKey[VALUE][index2], textColor);
						}
					});
				}
			break;
			case "variable": {
				let takeAwayQuotes = cmdInpArry[index].split('"');
				takeAwayQuotes.pop();
				takeAwayQuotes.shift();
				takeAwayQuotes = takeAwayQuotes[0].split('=');
				takeAwayQuotes[0] = takeAwayQuotes[0].replace(/\s/g, '');
				varKey[VARIABLE].push(takeAwayQuotes[0]);
				varKey[VALUE].push(takeAwayQuotes[1]);
				varKey[TYPE].push(STRING);
				//terminal_write("Var '" + varKey[VARIABLE][varKey[VARIABLE].length - 1] + "' saved: " + varKey[VALUE][varKey[VALUE].length - 1]);
			}
			break;
			case "variablen": {
				let takeAwayQuotes = cmdInpArry[index].split('"');
				takeAwayQuotes.pop();
				takeAwayQuotes.shift();
				takeAwayQuotes = takeAwayQuotes[0].replace(/\s/g, '');
				takeAwayQuotes = takeAwayQuotes.split('=');
				varKey[VARIABLE].push(takeAwayQuotes[0]);
				if (isNaN(Number(takeAwayQuotes[1]))) {
					terminal_write("Non number compatible value written to variablen!<br>");
				}
				varKey[VALUE].push(Number(takeAwayQuotes[1]));
				varKey[TYPE].push(INTEGER);
				console.log(varKey);
				//terminal_write("Var '" + varKey[VARIABLE][varKey[VARIABLE].length - 1] + "' saved: " + varKey[VALUE][varKey[VALUE].length - 1]);
			}
			break;
			case "setvar": {
				let takeAwayQuotes = cmdInpArry[index].split('"');
				takeAwayQuotes.pop();
				takeAwayQuotes.shift();
				takeAwayQuotes = takeAwayQuotes[0].split('=');
				takeAwayQuotes[0] = takeAwayQuotes[0].replace(/\s/g, '');
				takeAwayQuotes[1] = takeAwayQuotes[1].replace(/\s/g, '');

				varKey.forEach((item2, index2) => {
					if (takeAwayQuotes[VARIABLE] === varKey[VARIABLE][index2]) {
						if (takeAwayQuotes[VALUE] === "%GetTime")
							takeAwayQuotes[VALUE] = Date.now();
						console.log(takeAwayQuotes[1]);

						if (varKey[TYPE][index2] == INTEGER) {
							varKey[VALUE][index2] = Number(takeAwayQuotes[VALUE]);
						} else
							varKey[VALUE][index2] = takeAwayQuotes[VALUE];
					}
					console.log(varKey);
				});
			}
			break;
			case "if": {
				let abstractCommand = cmdInpArry[index];
				abstractCommand = abstractCommand.replace(/\s/g, '');
				
				if (abstractCommand.indexOf("==") != -1) {
					
					abstractCommand = abstractCommand.split("==");
					let rawVarData1;
					let rawVarData2;
					if (isNaN(Number(abstractCommand[0]))) {
						let variableIndex = find_variable(abstractCommand[0], varKey);
						rawVarData1 = varKey[VALUE][variableIndex];
					} else {
						rawVarData1 = Number(abstractCommand[0]);
					}
					if (isNaN(Number(abstractCommand[1]))) {
						let variableIndex = find_variable(abstractCommand[1], varKey);
						rawVarData2 = varKey[VALUE][variableIndex];
					} else {
						rawVarData2 = Number(abstractCommand[1]);
					}
					if (rawVarData1 === rawVarData2) {
					} else {
						let occurencesRequired = 1;
						let occurencesFound = 0;
						for (let i = index + 1; i < cmdArry.length; i++) {
							
							if (cmdArry[i] !== undefined && cmdArry[i].replace(/\s/g, '') === "}" && (cmdInpArry[i] !== "else" || occurencesRequired - occurencesFound === 1)) {
								++occurencesFound;
								if (occurencesFound === occurencesRequired) {
									
									index = i + 1;
									break;
								} else {
								}
							} else if (cmdArry[i] === "if") {
								++occurencesRequired;
							}
						}
					}
				} else if (abstractCommand.indexOf("<") != -1) {
					abstractCommand = abstractCommand.split("<");
					let rawVarData1;
					let rawVarData2;
					console.log(abstractCommand);
					if (isNaN(Number(abstractCommand[0]))) {
						let variableIndex = find_variable(abstractCommand[0], varKey);
						rawVarData1 = varKey[VALUE][variableIndex];
					} else {
						rawVarData1 = Number(abstractCommand[0]);
					}
					if (isNaN(Number(abstractCommand[1]))) {
						let variableIndex = find_variable(abstractCommand[1], varKey);
						rawVarData2 = varKey[VALUE][variableIndex];
					} else {
						rawVarData2 = Number(abstractCommand[1]);
					}
					if (rawVarData1 < rawVarData2 && typeof rawVarData1 === typeof rawVarData2) {
						
					} else {
						let occurencesRequired = 1;
						let occurencesFound = 0;
						for (let i = index + 1; i < cmdArry.length; i++) {
							
							if (cmdArry[i] !== undefined && cmdArry[i].replace(/\s/g, '') === "}" && (cmdInpArry[i] !== "else" || occurencesRequired - occurencesFound === 1)) {
								++occurencesFound;
								if (occurencesFound === occurencesRequired) {
									
									index = i + 1;
									break;
								} else {
								}
							} else if (cmdArry[i] === "if") {
								++occurencesRequired;
							}
						}
					}
				}
			}
			break;
			case "}": {
				console.log("found closing");
				let occurencesRequired = 1;
				let occurencesFound = 0;
				for (let i = index + 1; i < cmdArry.length; i++) {
					
					if (cmdArry[i] === "}" && (cmdInpArry[i] !== "else" || occurencesRequired - occurencesFound === 1)) {
						++occurencesFound;
						if (occurencesFound === occurencesRequired) {
							index = i + 1;
							break;
						} else {
						}
				} else if (cmdArry[i] === "if") {
						++occurencesRequired;
					}
				}
			}
			break;
			case "add": { // don't put quotes!!!
				let takeAwayQuotes = cmdInpArry[index];
				takeAwayQuotes = takeAwayQuotes.split('+');
				takeAwayQuotes[0] = takeAwayQuotes[0].replace(/\s/g, '');
				takeAwayQuotes[1] = takeAwayQuotes[1].replace(/\s/g, '');
				varKey.forEach((item2, index2) => {
					if (takeAwayQuotes[0] === varKey[0][index2]) {
						if (varKey[TYPE][index2] == INTEGER) {
							if (find_variable(varKey[VALUE][index2], varKey) !== false) {
								varKey[VALUE][index2] += Number(varKey[VALUE][find_variable(takeAwayQuotes[1], varKey)]);
							} else
								varKey[VALUE][index2] += Number(takeAwayQuotes[1]);
						} else if (varKey[TYPE][index2] == STRING)
							if (find_variable(varKey[VALUE][index2]) !== false) {
								varKey[VALUE][index2] += Number(varKey[VALUE][find_variable(takeAwayQuotes[1])]);
							} else
								terminal_write("Cannot add to string type!<br>");
						return;
					}
					console.log(varKey);
				});
			}
			break;
			case undefined:
			
			break;
			case "clearscreen":
				display.innerHTML = "";
			break;
			case "terminalcolor":
				textColor = remove_quotes(cmdInpArry[index]);
			break;
			case "input": {
				let splitComma = cmdInpArry[index].split(",");
				let inputVariable = find_variable(splitComma[1].replace(/\s/g, ''), varKey);
				if (varKey[TYPE][inputVariable] == INTEGER)
					varKey[VALUE][inputVariable] = Number(prompt(remove_quotes(splitComma[0])));
				else
					varKey[VALUE][inputVariable] = prompt(remove_quotes(splitComma[0]));
			}
			break;
			case "label": {
				// look in preprocessor
			}
			break;
			case "jump": {
				let hasFoundLabel = false;
				for (let i = 0; i < labelKey[LABELNAME].length; i++) {
					if (labelKey[LABELNAME][i] === cmdInpArry[index]) {
						console.log("found", cmdInpArry[index]);
						index = labelKey[LABELINDEX][i] + 1;
						hasFoundLabel = true;
						break;
					}
				}
				if (!hasFoundLabel)
					console.log("Could not jump to " + cmdInpArry[index]);
			}
			break;
			case "c":
				// for comments
			break;
			case "end":
				return;
			break;
			case "concat":
				if (!has_quotes(cmdInpArry[index]))
					var rawVar = cmdInpArry[index].replace(/\s/g, '');
				else
					var rawVar = cmdInpArry[index];
				rawVar = rawVar.split(",");
				let concatVars = {};
				let concattingTo = {};
				console.log(rawVar[0], varKey);
				if (find_variable(rawVar[0], varKey) !== -1) {
					//concatVars[0] = varKey[VALUE][find_variable(rawVar[0], varKey)];
					concattingTo = find_variable(rawVar[0], varKey);
				}
				if (varKey[TYPE][find_variable(rawVar[0], varKey)] !== STRING) {
					terminal_write("Cannot concatonate to a non-string variable!<br>");
					break;
				}
				
				if (find_variable(rawVar[1], varKey) !== -1) {
					concatVars[1] = varKey[VALUE][find_variable(rawVar[1], varKey)];
					console.log(concatVars[1]);
				} else {
					concatVars[1] = rawVar[1];
				}
				
				varKey[VALUE][concattingTo] += (varKey[TYPE][find_variable(rawVar[1], varKey)] == INTEGER) ? concatVars[1] : remove_quotes(concatVars[1]);
			break;
			case "flush":
				display.style.display = 'none';
				display.style.display = 'block';
			break;
			default:
				terminal_write('unknown command: ' + cmdArry[index] + "<br>");
			break;
		}
	}
	
	console.log(cmdArry, cmdInpArry);
}

function terminal_write(message, color) {
	if (typeof message === "string")
		message = message.replace(/\\n/g, "<br>");
	switch (color) {
		case "unefined":
			display.innerHTML += message;
		break;
		default:
			display.innerHTML += "<a style='color:" + color + "'>" + message + "</a>";
		break;
	}
}

function find_variable(varName, varKey) {
	for (let i = 0; i < varKey[VARIABLE].length; i++) {
		if (varName === varKey[VARIABLE][i]) {
			
			return i;
		}
	}
	
	return -1;
}

function remove_quotes(varWithQuotes) {
	if (varWithQuotes.includes('"')) {
		let takeAwayQuotes = varWithQuotes.split('"');
		if (takeAwayQuotes.length === 3) {
			takeAwayQuotes.pop();
			takeAwayQuotes.shift();
		}
		return takeAwayQuotes[0];
	} else {
		return varWithQuotes;
	}
}

function run_preprocessor(inputFuncs, inputCommands) {
	

	for (let index = 0; index < inputFuncs.length; index++) {
		if (inputFuncs[index] !== undefined)
			inputFuncs[index] = inputFuncs[index].replace(/\s/g, '');
		else
			continue;
		switch (inputFuncs[index]) {
			case "label": {
				labelKey[LABELNAME].push(remove_quotes(inputCommands[index]));
				labelKey[LABELINDEX].push(index);
			}
			break;
			default:
			    //terminal_write(inputFuncs[index]);
			break;
		}
	}
	
	console.log("new labels ", labelKey, " defined");
}

function has_quotes(varWithOrWithoutQuotes) {
	if (varWithOrWithoutQuotes.includes('"'))
		return true;
	else
		return false;
}

function run_textreplacement(originalInput) {
	originalInput = originalInput.replace(/@GetTime/g, Date.now());
	originalInput = originalInput.replace(/true/g, 1);
	originalInput = originalInput.replace(/false/g, 0);

	return originalInput;
}