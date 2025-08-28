import * as React from "react";
import { TextInput, TextInputProps } from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useDocumentListener } from "./document-listener";
import { KEYBOARD_SHORTCUTS } from "./constants";

type TextFilterProps = Omit<TextInputProps, "type" | "tabIndex"> & {
  label?: string;
};

export const TextFilter: React.FC<TextFilterProps> = (props) => {
  const { label, placeholder, autoFocus = false, ...otherInputProps } = props;
  const { ref } = useDocumentListener<HTMLInputElement>();
  const { t } = useTranslation();
  const placeholderText =
    placeholder ?? t("public~Filter {{label}}...", { label });

  return (
    <div className="co-text-filter">
      <TextInput
        {...otherInputProps}
        className="co-text-filter__text-input"
        data-test-id="item-filter"
        aria-label={placeholderText}
        placeholder={placeholderText}
        ref={ref}
        autoFocus={autoFocus}
        tabIndex={0}
        type="text"
      />
      <span className="co-text-filter__feedback">
        <kbd className="co-kbd co-kbd__filter-input">
          {KEYBOARD_SHORTCUTS.focusFilterInput}
        </kbd>
      </span>
    </div>
  );
};
TextFilter.displayName = "TextFilter";
