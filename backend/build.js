await Bun.build({
    entrypoints: ['src/index.ts'],
    outdir: 'dist',
    target: "node",
    minify: true,
})
console.log("Done!")