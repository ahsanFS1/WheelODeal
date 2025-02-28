import React from 'react';
import { LandingPageConfig } from '../../../types';
import { TextInput } from '../shared/TextInput';
import { Button } from '../../ui/button';
import { Plus, Trash } from 'lucide-react';

interface Props {
  data: LandingPageConfig['faq'];
  onChange: (data: LandingPageConfig['faq']) => void;
}

export const FaqEditor: React.FC<Props> = ({ data, onChange }) => {
  const addFaq = () => {
    const newId = (data.items.length + 1).toString();
    onChange({
      ...data,
      items: [
        ...data.items,
        {
          id: newId,
          question: 'New Question',
          answer: 'New Answer'
        }
      ]
    });
  };

  const updateFaq = (id: string, field: string, value: string) => {
    const newItems = data.items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, items: newItems });
  };

  const removeFaq = (id: string) => {
    const newItems = data.items.filter(item => item.id !== id);
    onChange({ ...data, items: newItems });
  };

  return (
    <div className="space-y-6">
      <TextInput
        label="Section Title"
        value={data.title}
        onChange={(value) => onChange({ ...data, title: value })}
      />

      <div className="space-y-4">
        {data.items.map((faq) => (
          <div key={faq.id} className="bg-[#121218] border border-[#C33AFF]/20 rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[#D3D3DF]">FAQ Item</h3>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeFaq(faq.id)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <TextInput
                label="Question"
                value={faq.question}
                onChange={(value) => updateFaq(faq.id, 'question', value)}
              />
              <TextInput
                label="Answer"
                value={faq.answer}
                onChange={(value) => updateFaq(faq.id, 'answer', value)}
                textArea
              />
            </div>
          </div>
        ))}

        <Button
          onClick={addFaq}
          className="w-full flex items-center justify-center gap-2 bg-purple-900 text-white hover:bg-purple-900/90"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </Button>
      </div>
    </div>
  );
};