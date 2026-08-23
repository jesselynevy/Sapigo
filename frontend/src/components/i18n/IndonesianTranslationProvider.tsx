"use client";

import { useEffect } from "react";
import { getAppLocale, translate } from "@/src/i18n/id";

const translatableAttributes = ["placeholder", "title", "aria-label", "alt"] as const;

function localizeElement(element: Element) {
  for (const attribute of translatableAttributes) {
    const value = element.getAttribute(attribute);
    if (value) {
      const localized = translate(value);
      if (localized !== value) element.setAttribute(attribute, localized);
    }
  }
}

function localizeTree(root: Node) {
  if (root.nodeType === Node.ELEMENT_NODE) localizeElement(root as Element);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (parent?.tagName !== "SCRIPT" && node.nodeValue) {
      const localized = translate(node.nodeValue);
      if (localized !== node.nodeValue) node.nodeValue = localized;
    }
  }
  if (root.nodeType === Node.ELEMENT_NODE) {
    (root as Element).querySelectorAll("*").forEach(localizeElement);
  }
}

/** Localizes both static React copy and text received asynchronously from APIs. */
export default function IndonesianTranslationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const activeLocale = getAppLocale();
    document.documentElement.lang = activeLocale;
    if (activeLocale !== "id") return;

    localizeTree(document.body);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData" && mutation.target.nodeValue) {
          const localized = translate(mutation.target.nodeValue);
          if (localized !== mutation.target.nodeValue) mutation.target.nodeValue = localized;
        }
        mutation.addedNodes.forEach(localizeTree);
        if (mutation.type === "attributes" && mutation.target instanceof Element) {
          localizeElement(mutation.target);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: [...translatableAttributes] });
    return () => observer.disconnect();
  }, []);

  return children;
}
