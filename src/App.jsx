import { TagsInput } from './components/TagsInput';

const App = () => {
  const selectedTags = (tags) => {
    console.log(tags);
  };
  return (
    <div className='App'>
      <TagsInput selectedTags={selectedTags} tags={['name 1', 'name 2']} />
    </div>
  );
};

export default App;
