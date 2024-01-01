export const getGitCommitHash = (): string => {
  const { stdout } = Bun.spawnSync({
    cmd: ['git', 'rev-parse', 'HEAD'],
    stdout: 'pipe'
  })

  return stdout.toString().substring(0, 7)
}
