import Fuse, {type IFuseOptions} from "fuse.js";
import type {CourseItem, Item, ProfessorItem} from "../typed/searchbox.ts";

export type SearchMode = "professor" | "course";

interface SearchQueryProfile {
    normalizedText: string;
    compactText: string;
    sortedTokensText: string;
    tokens: string[];
    normalizedProfessorText: string;
    compactProfessorText: string;
    professorTokens: string[];
    sortedProfessorTokensText: string;
    normalizedEmail: string;
    normalizedCourseTag: string;
    compactCourseTag: string;
    courseTagTokens: string[];
}

interface SearchDocument {
    id: string;
    item: Item;
    label: string;
    normalizedName: string;
    compactName: string;
    nameTokens: string[];
    sortedNameTokens: string;
    normalizedEmail: string;
    normalizedTag: string;
    compactTag: string;
    tagTokens: string[];
}

interface RankedDocument {
    document: SearchDocument;
    category: number;
    fieldPriority: number;
    candidateLengthDelta: number;
    fuseScore: number;
}

export interface PreparedSearchIndex {
    documents: SearchDocument[];
    fuse: Fuse<SearchDocument>;
    mode: SearchMode;
}

const SEARCH_BUFFER_LIMIT = 25;
const DEFAULT_FUSE_SCORE = 1;
const HONORIFIC_TOKENS = new Set(["dr", "doctor", "prof", "professor"]);
const COMBINING_MARKS_REGEX = /[\u0300-\u036f]/g;
const SEARCH_NOISE_REGEX = /[^\p{L}\p{N}\s]+/gu;
const EMAIL_NOISE_REGEX = /[^\p{L}\p{N}@._+\-\s]+/gu;

const PROFESSOR_FUSE_OPTIONS: IFuseOptions<SearchDocument> = {
    includeScore: true,
    ignoreLocation: true,
    shouldSort: true,
    threshold: 0.4,
    keys: [
        {name: "normalizedName", weight: 0.45},
        {name: "compactName", weight: 0.15},
        {name: "sortedNameTokens", weight: 0.15},
        {name: "normalizedEmail", weight: 0.25},
    ],
};

const COURSE_FUSE_OPTIONS: IFuseOptions<SearchDocument> = {
    includeScore: true,
    ignoreLocation: true,
    shouldSort: true,
    threshold: 0.4,
    keys: [
        {name: "compactTag", weight: 0.4},
        {name: "normalizedTag", weight: 0.25},
        {name: "normalizedName", weight: 0.25},
        {name: "sortedNameTokens", weight: 0.1},
    ],
};

export function createSearchIndex(items: ProfessorItem[] | CourseItem[], mode: SearchMode): PreparedSearchIndex {
    const documents = items.map((item) =>
        mode === "professor"
            ? createProfessorDocument(item as ProfessorItem)
            : createCourseDocument(item as CourseItem),
    );

    return {
        documents,
        fuse: new Fuse(documents, mode === "professor" ? PROFESSOR_FUSE_OPTIONS : COURSE_FUSE_OPTIONS),
        mode,
    };
}

export function searchPreparedIndex(index: PreparedSearchIndex, rawQuery: string, limit: number): Item[] {
    const query = createQueryProfile(rawQuery);
    const searchTerms = getSearchTerms(query, index.mode);

    if (!searchTerms.length) {
        return [];
    }

    const scoredDocuments = new Map<string, {document: SearchDocument; score: number}>();

    for (const term of searchTerms) {
        for (const result of index.fuse.search(term, {limit: SEARCH_BUFFER_LIMIT})) {
            const current = scoredDocuments.get(result.item.id);
            const nextScore = result.score ?? DEFAULT_FUSE_SCORE;

            if (!current || nextScore < current.score) {
                scoredDocuments.set(result.item.id, {
                    document: result.item,
                    score: nextScore,
                });
            }
        }
    }

    return Array.from(scoredDocuments.values())
        .map(({document, score}) => rankDocument(document, query, index.mode, score))
        .sort(compareRankedDocuments)
        .slice(0, limit)
        .map(({document}) => document.item);
}

function createProfessorDocument(item: ProfessorItem): SearchDocument {
    const normalizedName = normalizeProfessorName(item.name);
    const nameTokens = tokenize(normalizedName);

    return {
        id: `professor:${normalizeEmail(item.email)}`,
        item,
        label: item.name,
        normalizedName,
        compactName: compact(normalizedName),
        nameTokens,
        sortedNameTokens: sortTokens(nameTokens),
        normalizedEmail: normalizeEmail(item.email),
        normalizedTag: "",
        compactTag: "",
        tagTokens: [],
    };
}

function createCourseDocument(item: CourseItem): SearchDocument {
    const normalizedName = normalizeText(item.name);
    const nameTokens = tokenize(normalizedName);
    const normalizedTag = normalizeCourseTag(item.tag);
    const tagTokens = tokenize(normalizedTag);

    return {
        id: `course:${compact(normalizedTag) || normalizeText(item.tag)}`,
        item,
        label: `${item.tag} ${item.name}`,
        normalizedName,
        compactName: "",
        nameTokens,
        sortedNameTokens: sortTokens(nameTokens),
        normalizedEmail: "",
        normalizedTag,
        compactTag: compact(normalizedTag),
        tagTokens,
    };
}

function createQueryProfile(rawValue: string): SearchQueryProfile {
    const normalizedText = normalizeText(rawValue);
    const tokens = tokenize(normalizedText);
    const normalizedProfessorText = normalizeProfessorName(rawValue);
    const professorTokens = tokenize(normalizedProfessorText);
    const normalizedCourseTag = normalizeCourseTag(rawValue);

    return {
        normalizedText,
        compactText: compact(normalizedText),
        sortedTokensText: sortTokens(tokens),
        tokens,
        normalizedProfessorText,
        compactProfessorText: compact(normalizedProfessorText),
        professorTokens,
        sortedProfessorTokensText: sortTokens(professorTokens),
        normalizedEmail: normalizeEmail(rawValue),
        normalizedCourseTag,
        compactCourseTag: compact(normalizedCourseTag),
        courseTagTokens: tokenize(normalizedCourseTag),
    };
}

function getSearchTerms(query: SearchQueryProfile, mode: SearchMode): string[] {
    const values = mode === "professor"
        ? [query.normalizedProfessorText, query.compactProfessorText, query.sortedProfessorTokensText, query.normalizedEmail]
        : [query.normalizedText, query.compactText, query.sortedTokensText, query.normalizedCourseTag, query.compactCourseTag];

    return Array.from(new Set(values.filter(Boolean)));
}

function rankDocument(document: SearchDocument, query: SearchQueryProfile, mode: SearchMode, fuseScore: number): RankedDocument {
    const exactMatch = getExactMatch(document, query, mode);

    if (exactMatch) {
        return {
            document,
            category: 0,
            fieldPriority: exactMatch.fieldPriority,
            candidateLengthDelta: exactMatch.candidateLengthDelta,
            fuseScore,
        };
    }

    const prefixMatch = getPrefixMatch(document, query, mode);

    if (prefixMatch) {
        return {
            document,
            category: 1,
            fieldPriority: prefixMatch.fieldPriority,
            candidateLengthDelta: prefixMatch.candidateLengthDelta,
            fuseScore,
        };
    }

    const orderedMatch = getOrderedTokenMatch(document, query, mode);

    if (orderedMatch) {
        return {
            document,
            category: 2,
            fieldPriority: orderedMatch.fieldPriority,
            candidateLengthDelta: orderedMatch.candidateLengthDelta,
            fuseScore,
        };
    }

    const unorderedMatch = getUnorderedTokenMatch(document, query, mode);

    if (unorderedMatch) {
        return {
            document,
            category: 3,
            fieldPriority: unorderedMatch.fieldPriority,
            candidateLengthDelta: unorderedMatch.candidateLengthDelta,
            fuseScore,
        };
    }

    return {
        document,
        category: 4,
        fieldPriority: 99,
        candidateLengthDelta: Number.MAX_SAFE_INTEGER,
        fuseScore,
    };
}

function getExactMatch(document: SearchDocument, query: SearchQueryProfile, mode: SearchMode) {
    const candidates = mode === "professor"
        ? [
            {value: document.normalizedName, queries: [query.normalizedProfessorText], fieldPriority: 0},
            {value: document.compactName, queries: [query.compactProfessorText], fieldPriority: 1},
            {value: document.normalizedEmail, queries: [query.normalizedEmail], fieldPriority: 1},
        ]
        : [
            {value: document.compactTag, queries: [query.compactCourseTag, query.compactText], fieldPriority: 0},
            {value: document.normalizedTag, queries: [query.normalizedCourseTag, query.normalizedText], fieldPriority: 0},
            {value: document.normalizedName, queries: [query.normalizedText], fieldPriority: 1},
        ];

    return getCandidateMatch(candidates, "exact");
}

function getPrefixMatch(document: SearchDocument, query: SearchQueryProfile, mode: SearchMode) {
    const candidates = mode === "professor"
        ? [
            {value: document.normalizedName, queries: [query.normalizedProfessorText], fieldPriority: 0},
            {value: document.compactName, queries: [query.compactProfessorText], fieldPriority: 1},
            {value: document.normalizedEmail, queries: [query.normalizedEmail], fieldPriority: 1},
        ]
        : [
            {value: document.compactTag, queries: [query.compactCourseTag, query.compactText], fieldPriority: 0},
            {value: document.normalizedTag, queries: [query.normalizedCourseTag, query.normalizedText], fieldPriority: 0},
            {value: document.normalizedName, queries: [query.normalizedText], fieldPriority: 1},
        ];

    return getCandidateMatch(candidates, "prefix");
}

function getOrderedTokenMatch(document: SearchDocument, query: SearchQueryProfile, mode: SearchMode) {
    const orderedTokens = mode === "course" ? query.courseTagTokens : query.professorTokens;

    if (!orderedTokens.length) {
        return null;
    }

    const candidates = mode === "professor"
        ? [
            {value: document.normalizedName, fieldPriority: 0},
            {value: document.normalizedEmail, fieldPriority: 1},
        ]
        : [
            {value: document.normalizedTag, fieldPriority: 0},
            {value: document.normalizedName, fieldPriority: 1},
        ];

    for (const candidate of candidates) {
        if (!candidate.value) {
            continue;
        }

        if (containsTokensInOrder(candidate.value, orderedTokens)) {
            return {
                fieldPriority: candidate.fieldPriority,
                candidateLengthDelta: Math.max(0, candidate.value.length - orderedTokens.join(" ").length),
            };
        }
    }

    return null;
}

function getUnorderedTokenMatch(document: SearchDocument, query: SearchQueryProfile, mode: SearchMode) {
    const tokens = mode === "course" ? query.courseTagTokens : query.professorTokens;

    if (!tokens.length) {
        return null;
    }

    const candidates = mode === "professor"
        ? [
            {tokens: document.nameTokens, value: document.normalizedName, fieldPriority: 0},
        ]
        : [
            {tokens: document.tagTokens, value: document.normalizedTag, fieldPriority: 0},
            {tokens: document.nameTokens, value: document.normalizedName, fieldPriority: 1},
        ];

    for (const candidate of candidates) {
        if (!candidate.value || !candidate.tokens.length) {
            continue;
        }

        if (containsTokensInAnyOrder(candidate.tokens, tokens)) {
            return {
                fieldPriority: candidate.fieldPriority,
                candidateLengthDelta: Math.max(0, candidate.value.length - tokens.join(" ").length),
            };
        }
    }

    return null;
}

function getCandidateMatch(
    candidates: Array<{value: string; queries: string[]; fieldPriority: number}>,
    mode: "exact" | "prefix",
) {
    let bestMatch: {fieldPriority: number; candidateLengthDelta: number} | null = null;

    for (const candidate of candidates) {
        if (!candidate.value) {
            continue;
        }

        for (const query of candidate.queries) {
            if (!query) {
                continue;
            }

            const matches = mode === "exact" ? candidate.value === query : candidate.value.startsWith(query);

            if (!matches) {
                continue;
            }

            const candidateMatch = {
                fieldPriority: candidate.fieldPriority,
                candidateLengthDelta: Math.max(0, candidate.value.length - query.length),
            };

            if (
                !bestMatch ||
                candidateMatch.fieldPriority < bestMatch.fieldPriority ||
                (
                    candidateMatch.fieldPriority === bestMatch.fieldPriority &&
                    candidateMatch.candidateLengthDelta < bestMatch.candidateLengthDelta
                )
            ) {
                bestMatch = candidateMatch;
            }
        }
    }

    return bestMatch;
}

function compareRankedDocuments(left: RankedDocument, right: RankedDocument) {
    return left.category - right.category
        || left.fieldPriority - right.fieldPriority
        || left.candidateLengthDelta - right.candidateLengthDelta
        || left.fuseScore - right.fuseScore
        || left.document.label.localeCompare(right.document.label);
}

function normalizeText(value: string): string {
    return collapseWhitespace(
        stripDiacritics(value)
            .toLowerCase()
            .replace(SEARCH_NOISE_REGEX, " "),
    );
}

function normalizeProfessorName(value: string): string {
    const normalizedValue = normalizeText(value);

    return tokenize(normalizedValue)
        .filter((token) => !HONORIFIC_TOKENS.has(token))
        .join(" ");
}

function normalizeEmail(value: string): string {
    return collapseWhitespace(
        stripDiacritics(value)
            .toLowerCase()
            .replace(EMAIL_NOISE_REGEX, " "),
    ).replace(/\s+/g, "");
}

function normalizeCourseTag(value: string): string {
    return normalizeText(
        value
            .replace(/([a-zA-Z])(\d)/g, "$1 $2")
            .replace(/(\d)([a-zA-Z])/g, "$1 $2"),
    );
}

function containsTokensInOrder(value: string, tokens: string[]): boolean {
    let searchIndex = 0;

    for (const token of tokens) {
        const tokenIndex = value.indexOf(token, searchIndex);

        if (tokenIndex === -1) {
            return false;
        }

        searchIndex = tokenIndex + token.length;
    }

    return true;
}

function containsTokensInAnyOrder(valueTokens: string[], queryTokens: string[]): boolean {
    return queryTokens.every((token) => valueTokens.includes(token));
}

function stripDiacritics(value: string): string {
    return value.normalize("NFKD").replace(COMBINING_MARKS_REGEX, "");
}

function collapseWhitespace(value: string): string {
    return value.replace(/\s+/g, " ").trim();
}

function compact(value: string): string {
    return value.replace(/\s+/g, "");
}

function tokenize(value: string): string[] {
    return value.split(" ").filter(Boolean);
}

function sortTokens(tokens: string[]): string {
    return [...tokens].sort((left, right) => left.localeCompare(right)).join(" ");
}
