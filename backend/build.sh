#!/bin/bash

cd "$(dirname "$0")"

mv .env .temp-env

build() {
    local arch=$1
    bun build --minify --sourcemap src/index.ts --compile --target=bun-linux-${arch} --outfile ./dist/backend-linux-${arch}
}

build_docker() {
    local arch=$1
    local dockerfile="Dockerfile-${arch}"
    docker build -f $dockerfile -t createchstudio/vgorc-tm-backend:${arch} .
}

echo "Select Platform:"
echo "1) macOS"
echo "2) Linux"
echo "3) Windows"
echo "4) Docker"
read -p "Enter choice [1-4]: " platform_choice

case $platform_choice in
    1) PLATFORM="darwin"; echo "Building for macOS is not supported in this script"; exit 1 ;;
    2) PLATFORM="linux"; echo "Building for Linux is not supported in this script"; exit 1 ;;
    3) PLATFORM="windows"; echo "Building for Windows is not supported in this script"; exit 1 ;;
    4) PLATFORM="docker" ;;
    *) echo "Invalid choice"; exit 1 ;;
esac

if [ "$PLATFORM" == "docker" ]; then
    echo "Select Architecture:"
    echo "1) 64-bit"
    echo "2) ARM 64-bit"
    read -p "Enter choice [1-2]: " arch_choice

    case $arch_choice in
        1) ARCH="x64" ;;
        2) ARCH="arm64" ;;
        *) echo "Invalid choice"; exit 1 ;;
    esac

    build $ARCH
    build_docker $ARCH
fi

rm -f .*.bun-build
mv .temp-env .env