import axios from "axios";
import { unlinkSync } from "fs";

export async function load() {
    axios.post("http://127.0.0.1:5050/load", { path: "dump.json"});
}

export async function dump() {
    axios.post("http://127.0.0.1:5050/dump", {path: " dump.json" })
}

export async function reset() {
    axios.post("http://127.0.0.1:5050/reset")
}

export function cleanup() {
    try {
        unlinkSync("./dump.json");
    } catch (err) {}
}