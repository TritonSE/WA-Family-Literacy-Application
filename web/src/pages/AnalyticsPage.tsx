import React, { useState, useEffect, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Label, ResponsiveContainer } from 'recharts';
import { APIContext } from '../context/APIContext';

import '../App.css';
import styles from './AnalyticsPage.module.css';

export const AnalyticsPage: React.FC = () => {
  const [bookAnalytics, setBookAnalytics] = useState<{
    id: string, title: string; date: string; week: number; month: number
  }[]>([]);
  const [clicksGraphData, setClicksGraphData] = useState<{ day: string; clicks: number; }[]>([]);
  const [weekView, setWeekView] = useState(true);
  const [highestView, setHighestView] = useState(true);

  const client = useContext(APIContext);

  // generates mm/dd/yyyy date string from timestamp string
  function dateToString(dateStr: string): string {
    const date = new Date(dateStr);
    const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
    return (month + 1) + "/" + day + "/" + year;
  }

  // generates mm/dd date string for day offset from current day
  function dateFromToday(offset: number): string {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const [month, day] = [date.getMonth(), date.getDate()];
    return (month + 1) + "/" + day;
  }

  useEffect(
    () => {
      (async () => {
        const analyticsRes = await client.getAllBookAnalytics(30);
        const bookIDs = Object.keys(analyticsRes);

        // sum daily clicks of all books for interaction over time graph
        const allClicks = bookIDs.map(id => analyticsRes[id]).reduce((r, a) => {
          a.forEach((b, i) => {
            r[i] = (r[i] || 0) + b;
          });
          return r;
        }, []);

        // date and click count for past 30 days used in graph
        setClicksGraphData(allClicks.map((nClicks, idx) =>
          ({
            day: dateFromToday(29 - idx),
            clicks: nClicks,
          })
        ));

        // combined clicks count and book info for clicks lists
        const booksRes = await client.getBooks();
        setBookAnalytics(booksRes.map(book =>
          ({
            id: book.id,
            title: book.title,
            date: book.created_at,
            // sum of last 7 days
            week: analyticsRes[book.id].slice(-7).reduce((a, b) => a + b, 0),
            // sum of last 30 days
            month: analyticsRes[book.id].reduce((a, b) => a + b, 0),
          })
        ));
      })();
    },
    [],
  );

  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>User Interaction over Time</p>
      <ResponsiveContainer width="100%" height={500} className={styles.chartWrapper}>
        <LineChart
          data={clicksGraphData}
          margin={{
            top: 50,
            right: 30,
            left: 20,
            bottom: 50,
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            interval={6}
            axisLine={false}
            tickLine={false}
          >
            <Label
              className={styles.graphLabel}
              position="bottom"
            >
              Date
            </Label>
          </XAxis>
          <YAxis axisLine={false} tickLine={false} >
            <Label
              className={styles.graphLabel}
              angle={270}
              position='left'
              style={{ textAnchor: 'middle' }}
            >
              All Book Clicks
            </Label>
          </YAxis>
          <Tooltip />
          <Line type="monotone" dataKey="clicks" stroke="#E89228" strokeWidth={5} dot={false} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>

      <p className={styles.title}>Recent Releases</p>
      <table className={styles.analyticsTable}>
        <tr className={styles.tableHeader}>
          <td>Title</td>
          <td>Clicks (last 30 days)</td>
          <td>Released</td>
        </tr>
        {bookAnalytics.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }).slice(0, 10).map(analytic =>
          <tr key={analytic.id}>
            <td>
              {analytic.title}
            </td>
            <td>
              {analytic.month}
            </td>
            <td>
              {dateToString(analytic.date)}
            </td>
          </tr>)}
      </table>

      <div>
        <select
          className={styles.title}
          onChange={(e) => setHighestView(e.target.value === "highest")}
        >
          <option value="highest">Highest Clicks</option>
          <option value="lowest">Lowest Clicks</option>
        </select>
        <button
          className={`${styles.button} ${weekView && styles.buttonActive}`}
          onClick={() => setWeekView(true)}>
          Week
        </button>
        <button
          className={`${styles.button} ${!weekView && styles.buttonActive}`}
          onClick={() => setWeekView(false)}>
          Month
        </button>
      </div>
      <table className={styles.analyticsTable}>
        <tr className={styles.tableHeader}>
          <td>Title</td>
          {weekView ? <td>Clicks (last 7 days)</td> : <td>Clicks (last 30 days)</td>}
          <td>Released</td>
        </tr>
        {bookAnalytics.sort((a, b) => {
          let itemA;
          let itemB;
          if (weekView) {
            itemA = a.week;
            itemB = b.week;
          }
          else {
            itemA = a.month;
            itemB = b.month;
          }
          if(highestView) {
            return itemB - itemA;
          }
          return itemA - itemB;
        }).slice(0, 10).map(analytic =>
          <tr key={analytic.id}>
            <td>
              {analytic.title}
            </td>
            <td>
              {weekView ? analytic.week : analytic.month}
            </td>
            <td>
              {dateToString(analytic.date)}
            </td>
          </tr>)}
      </table>
    </div>
  );
};
