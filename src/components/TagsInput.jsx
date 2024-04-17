import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PropTypes from 'prop-types';

export const TagsInput = (props) => {
  const [tags, setTags] = useState(props.tags);
  const [formulas, setFormulas] = useState([]);
  const [text, setText] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const removeTags = (indexToRemove) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)]);
  };
  const addTags = (event) => {
    if (event.target.value !== '') {
      setTags([...tags, event.target.value]);
      props.selectedTags([...tags, event.target.value]);
      event.target.value = '';
    }
  };

  useQuery({
    queryKey: ['cat'],
    queryFn: () => {
      return axios
        .get('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete')
        .then((res) => setFormulas(res.data));
    },
  });

  const onSuggesthandler = (text) => {
    setText(text);
    setSuggestions([]);
  };

  const onChangeHandler = (text) => {
    let matches = [];
    if (text.length > 0) {
      matches = formulas.filter((frml) => {
        const regex = new RegExp(`${text}`, 'gi');
        return frml.name.match(regex);
      });
    }
    setSuggestions(matches);
    setText(text);
  };

  return (
    <div className='tags-input'>
      <ul id='tags'>
        {tags.map((tag, index) => (
          <li key={index} className='tag'>
            <span className='tag-title'>{tag}</span>
            <span className='tag-close-icon' onClick={() => removeTags(index)}>
              x
            </span>
          </li>
        ))}
      </ul>
      <input
        type='text'
        onKeyUp={(event) => (event.key === 'Enter' ? addTags(event) : null)}
        placeholder='Press enter for adding tags'
        onChange={(e) => onChangeHandler(e.target.value)}
        value={text}
        onBlur={() => {
          setTimeout(() => {
            setSuggestions([]);
          }, 100);
        }}
      />
      {suggestions &&
        suggestions.map((suggestion, index) => (
          <div key={index} onClick={() => onSuggesthandler(suggestion.name)}>
            {suggestion.name}
          </div>
        ))}
    </div>
  );
};

TagsInput.propTypes = {
  tags: PropTypes.array,
  selectedTags: PropTypes.func,
};
