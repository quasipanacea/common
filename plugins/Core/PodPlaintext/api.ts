export async function onCreate(dir: string) {
	console.log("created", dir);
}

export async function onRemove(dir: string) {
	console.log("removed", dir);
}
