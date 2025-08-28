import * as React from "react";
import { css } from "@patternfly/react-styles";
import { useDocumentListener, KeyEventModes } from "./document-listener";
import { getLabelsAsString } from "./label-filter";
import { fuzzyCaseInsensitive } from "./table-filters";
import { TextFilter } from "./list-page";
import { Label, SelectList } from "@patternfly/react-core";
import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";

const MAX_SUGGESTIONS = 5;

const labelParser = (
  resources: K8sResourceCommon[],
  labelPath: string
): Set<string> => {
  return resources.reduce((acc: Set<string>, resource: K8sResourceCommon) => {
    getLabelsAsString(resource, labelPath).forEach((label) => acc.add(label));
    return acc;
  }, new Set<string>());
};

const suggestionBoxKeyHandler = {
  Escape: KeyEventModes.HIDE,
};

type SuggestionLineProps = {
  suggestion: string;
  onClick: (param: string) => void;
  color: React.ComponentProps<typeof Label>["color"];
};

const SuggestionLine: React.FC<SuggestionLineProps> = ({
  suggestion,
  onClick,
  color,
}) => {
  return (
    <div>
      <Label
        variant="outline"
        onClick={() => onClick(suggestion)}
        data-test="suggestion-line"
        color={color}
      >
        {suggestion}
      </Label>
    </div>
  );
};

type AutocompleteInputProps = {
  onSuggestionSelect: (selected: string) => void;
  placeholder?: string;
  suggestionCount?: number;
  showSuggestions?: boolean;
  textValue: string;
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
  color?: SuggestionLineProps["color"];
  data?: K8sResourceCommon[];
  labelPath?: string;
};

const AutocompleteInput: React.FC<AutocompleteInputProps> = (props) => {
  const [suggestions, setSuggestions] = React.useState<string[]>();
  const { visible, setVisible, ref } = useDocumentListener<HTMLDivElement>(
    suggestionBoxKeyHandler
  );
  const {
    textValue,
    setTextValue,
    onSuggestionSelect,
    placeholder,
    showSuggestions,
    data,
    color,
    labelPath,
  } = props;

  const onSelect = (value: string) => {
    onSuggestionSelect(value);
    if (visible) {
      setVisible(false);
    }
  };

  const activate = () => {
    if (textValue.trim()) {
      setVisible(true);
    }
  };

  const handleInput = (
    event: React.FormEvent<HTMLInputElement>,
    input: string
  ) => {
    if (input) {
      setVisible(true);
    } else {
      setVisible(false);
    }
    setTextValue(input);
  };

  React.useEffect(() => {
    if (textValue && visible && showSuggestions) {
      const processed = labelParser(data, labelPath);
      // User input without whitespace
      const processedText = textValue.trim().replace(/\s*=\s*/, "=");
      const filtered = [...processed]
        .filter((item) => fuzzyCaseInsensitive(processedText, item))
        .slice(0, MAX_SUGGESTIONS);
      setSuggestions(filtered);
    }
  }, [visible, textValue, showSuggestions, data, labelPath]);

  return (
    <div className="co-suggestion-box" ref={ref}>
      <TextFilter
        value={textValue}
        onChange={handleInput}
        placeholder={placeholder}
        onFocus={activate}
      />
      {showSuggestions && (
        <SelectList
          className={css("co-suggestion-box__suggestions", {
            "co-suggestion-box__suggestions--shadowed":
              visible && suggestions?.length > 0,
          })}
        >
          {visible &&
            suggestions?.map((elem) => (
              <SuggestionLine
                suggestion={elem}
                key={elem}
                onClick={onSelect}
                color={color}
              />
            ))}
        </SelectList>
      )}
    </div>
  );
};

export default AutocompleteInput;
