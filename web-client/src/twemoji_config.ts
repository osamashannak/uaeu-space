export const TWEMOJI_ASSET_BASE_URL = "https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/";

export const getTwemojiSvgUrl = (unified: string) => {
    return `${TWEMOJI_ASSET_BASE_URL}svg/${unified.toLowerCase()}.svg`;
}
