{
  description = "Atelier dev shell -- provides Nix-managed Playwright browsers for Vitest browser-mode tests";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs =
    { self, nixpkgs }:
    let
      forAllSystems =
        f: nixpkgs.lib.genAttrs [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ] (system: f nixpkgs.legacyPackages.${system});
    in
    {
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          packages = [
            pkgs.nodejs_22
            pkgs.pnpm
            pkgs.playwright-driver.browsers
          ];

          # Point the npm `playwright` package at the Nix-built browsers instead of
          # downloading its own (the downloads are dynamically linked against glibc
          # paths NixOS doesn't have). The npm playwright version MUST match
          # playwright-driver.version below or the browser revision won't resolve.
          shellHook = ''
            export PLAYWRIGHT_BROWSERS_PATH="${pkgs.playwright-driver.browsers}"
            export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true
            export PLAYWRIGHT_NODEJS_PATH="${pkgs.nodejs_22}/bin/node"
            echo "playwright-driver ${pkgs.playwright-driver.version} -> pin npm playwright to the same version"
          '';
        };
      });
    };
}
