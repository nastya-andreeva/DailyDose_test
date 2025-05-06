import React from 'react';
import { render, screen } from '@testing-library/react';
import { MedicationIcon } from '../components/MedicationIcon';
import '@testing-library/jest-dom';

jest.mock('lucide-react-native', () => {
    const Icon = (name: string) => (props: any) => (
      <span
        data-testid="icon"
        style={{ color: props.color, fontSize: props.size }}
      >
        {name}Icon
      </span>
    );
  
    return {
      Pill: Icon('Pill'),
      Stethoscope: Icon('Stethoscope'),
      Heart: Icon('Heart'),
      Activity: Icon('Activity'),
      Droplet: Icon('Droplet'),
      Thermometer: Icon('Thermometer'),
      Syringe: Icon('Syringe'),
      Bandage: Icon('Bandage'),
      Brain: Icon('Brain'),
      Eye: Icon('Eye'),
      Ear: Icon('Ear'),
      Bone: Icon('Bone'),
    };
  });
  
  

describe('MedicationIcon', () => {
  it('отображает иконку Pill по умолчанию', () => {
    render(<MedicationIcon iconName="Unknown" />);
    expect(screen.getByText('PillIcon')).toBeInTheDocument();
  });

  it('отображает правильную иконку для каждого типа', () => {
    const icons = [
      'Pill',
      'Stethoscope',
      'Heart',
      'Activity',
      'Droplet',
      'Thermometer',
      'Syringe',
      'Bandage',
      'Brain',
      'Eye',
      'Ear',
      'Bone'
    ];

    icons.forEach(iconName => {
      const { unmount } = render(<MedicationIcon iconName={iconName} />);
      expect(screen.getByText(`${iconName}Icon`)).toBeInTheDocument();
      unmount();
    });
  });

  it('применяет переданный цвет и размер', () => {
    const testColor = '#ff0000';
    const testSize = 32;
    
    render(
      <MedicationIcon 
        iconName="Pill" 
        color={testColor} 
        size={testSize} 
      />
    );
  
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle({
      color: testColor,
      fontSize: `${testSize}px`,
    });
  });
  
  it('использует размер по умолчанию, если не передан', () => {
    render(<MedicationIcon iconName="Pill" />);
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle({
      fontSize: '24px',
    });
  });
  

  it('использует размер по умолчанию, если не передан', () => {
    render(<MedicationIcon iconName="Pill" />);
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveStyle({
      fontSize: '24px',
    });
  });
});