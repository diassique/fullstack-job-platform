import React from 'react';
import { Grid, Typography, Container, Card, CardContent } from '@mui/material';

export default function BlogPage() {

  const blogs = [
    {title: 'Effective Onboarding Strategies', content: 'Discover effective onboarding strategies to integrate new employees into your workplace culture.'},
    {title: 'HR Analytics for Decision-Making', content: 'Learn how HR analytics can help you make informed decisions about workforce management.'},
    {title: 'Workplace Diversity and Inclusion', content: 'Understand the benefits of promoting diversity and inclusion in the workplace.'},
    {title: 'Strategies for Employee Retention', content: 'Explore strategies to boost employee retention and maintain a talented, motivated workforce.'},
    {title: 'Best Practices for Performance Reviews', content: 'Find out the best practices for conducting effective performance reviews that motivate employees.'},
    {title: 'Managing Remote Teams', content: 'Gain insights on how to effectively manage remote teams and ensure productivity.'},
    {title: 'The Role of HR in Corporate Social Responsibility', content: 'Learn about HR’s role in advancing corporate social responsibility initiatives.'},
    {title: 'Navigating HR Compliance Issues', content: 'Learn about key HR compliance issues and how to navigate them effectively.'},
    {title: 'Building a Positive Company Culture', content: 'Discover how to build a positive company culture that attracts and retains top talent.'},
    {title: 'HR’s Role in Change Management', content: 'Understand the critical role of HR in effective change management.'},
  ];

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} paddingTop={5} paddingBottom={5}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            HR Resources
          </Typography>
        </Grid>
        {blogs.map((blog, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {blog.title}
                </Typography>
                <Typography variant="body2">
                  {blog.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}