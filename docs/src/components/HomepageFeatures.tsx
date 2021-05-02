import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: 'CI Agnostic',
    Svg: require('../../static/img/undraw_Select_option_re_u4qn.svg').default,
    description: (
      <>
        Captain's Log can be used with <i>any</i> build tool.
      </>
    ),
  },
  {
    title: 'Highly Configurable',
    Svg: require('../../static/img/undraw_Dev_focus_re_6iwt.svg').default,
    description: (
      <>Almost every facet of Captain's Log is configurable so that you can have full control of your release logs.</>
    ),
  },
  {
    title: 'Seamless Integration',
    Svg: require('../../static/img/undraw_circuit_board_4c4d.svg').default,
    description: (
      <>
        Captain's Log supports Github Issues and Jira out of the box, all sent to Slack using the beautiful Blocks API.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
