import * as React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Heading } from '@react-email/components';

interface EmailLayoutProps {
  previewText?: string;
  title: string;
  children: React.ReactNode;
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({ previewText, title, children }) => {
  return (
    <Html>
      <Head />
      {previewText && <Preview>{previewText}</Preview>}
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Heading style={heading}>{title}</Heading>
            {children}
            <Text style={footer}>
              Best regards,<br />
              The CodeZeniths Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f9f9f9',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const content = {
  backgroundColor: '#ffffff',
  padding: '40px',
  borderRadius: '8px',
  border: '1px solid #e8e8e8',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#333333',
  margin: '0 0 20px',
};

const footer = {
  fontSize: '14px',
  color: '#888888',
  margin: '30px 0 0',
  lineHeight: '22px',
};
