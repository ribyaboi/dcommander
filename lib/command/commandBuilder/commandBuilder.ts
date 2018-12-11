import {Command, CommandInstructions} from "../command";
import {ArgumentSchemaTypeBuilder} from "../../schema/schemaBuilder/typeBuilder/schemaTypeBuilder";
import {ArgumentSchema} from "../../schema/schema";
import {User} from "discord.js";

export class CommandBuilder {
    __command: Command;

    constructor(commandName: string) {
        this.__command = new Command(commandName);
    }

    execute(execute: (instructions: CommandInstructions) => void): this {
        if (this.__command.execution) {
            throw new Error("Command already has a set execution function");
        }
        this.__command.execution = execute;
        return this;
    }

    arguments(argumentBuilders: ArgumentSchemaTypeBuilder[]): this {
        const builtArguments: ArgumentSchema[] = argumentBuilders.map(argumentBuilder => argumentBuilder.__build());

        const argumentNameCount = builtArguments.reduce((acc, curr) => Object.assign(acc, {[curr.name]: (acc[curr.name] || 0) + 1}), {});

        if (Object.keys(argumentNameCount).filter((countItem: string) => argumentNameCount[countItem] > 1).length > 0) {
            throw new Error("Command cannot have multiple arguments with the same name");
        }

        if (this.__command.arguments) {
            throw new Error("Command already has arguments. Please define args as an array.");
        }
        this.__command.arguments = builtArguments;
        return this;
    }

    cooldown(cooldown: number): this {
        if (this.__command.cooldown) {
            throw new Error("Command already has a cooldown.")
        }
        this.__command.cooldown = cooldown;
        return this;
    }

    canExecute(canExecute: (user: User) => boolean): this {
        if (this.__command.canExecute) {
            throw new Error("Command already has a set canExecute function");
        }
        this.__command.canExecute = canExecute;
        return this;
    }

    prefix(prefix: string): this {
        //if dcommander has default prefix set then take that instead if none taken
        if (this.__command.prefix) {
            throw new Error("Command already has a set prefix");
        }
        this.__command.prefix = prefix;
        return this;
    }

    __build(): Command {
        if (!this.__command.execution) {
            throw new Error("No execution for command set");
        }
        return this.__command;
    }
}

export function command(commandName: string): CommandBuilder {
    return new CommandBuilder(commandName);
}