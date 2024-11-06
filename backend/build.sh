#!/bin/bash

cd "$(dirname "$0")"

mv .env .temp-env

build() {
    local platform=$1
    local arch=$2
    bun build --minify --sourcemap src/index.ts --compile --target=bun-${platform}-${arch} --outfile ./dist/backend-${platform}-${arch}
}

echo "Select Platform:"
echo "1) macOS"
echo "2) Linux"
echo "3) Windows"
read -p "Enter choice [1-3]: " platform_choice

case $platform_choice in
    1) PLATFORM="darwin" ;;
    2) PLATFORM="linux" ;;
    3) PLATFORM="windows" ;;
    *) echo "Invalid choice"; exit 1 ;;
esac

echo "Select Architecture:"
echo "1) 64-bit"
echo "2) ARM 64-bit"
read -p "Enter choice [1-2]: " arch_choice

case $arch_choice in
    1) ARCH="x64" ;;
    2) ARCH="arm64" ;;
    *) echo "Invalid choice"; exit 1 ;;
esac

build $PLATFORM $ARCH
rm -f .*.bun-build
mv .temp-env .env