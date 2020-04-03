import { Command, Argument } from 'discord-akairo';
import { MessageEmbed } from 'discord.js';
import { NovelCovid } from 'novelcovid';
import moment from 'moment';

class CovidCommand extends Command {
  constructor() {
    super('covid', {
      aliases: ['covid', 'coronavirus', 'corona', 'cv'],
      description: {
        content: 'Returns general COVID-19 stats.',
        usage: '[country | state | top]',
      },
      category: 'utility',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'text',
          match: 'content',
          type: Argument.union(['top'], 'string'),
        },
      ],
    });
  }

  async exec(msg, args) {
    const track = new NovelCovid();
    let data;
    if (args.text) {
      if (args.text === 'top') {
        data = await track.countries(null, 'sort by');
        const covidEmbed = new MessageEmbed()
          .setTitle('COVID-19 Statistics | Top 10 Countries')
          .setThumbnail(
            'https://cdn.discordapp.com/attachments/651043953755422721/695297024568066058/covid.png'
          );
        for (let i = 0; i < 10; i += 1) {
          const name = data[Object.keys(data)[i]].country;
          const description = `${data[
            Object.keys(data)[i]
          ].cases.toLocaleString()} cases ${data[
            Object.keys(data)[i]
          ].deaths.toLocaleString()} deaths ${data[
            Object.keys(data)[i]
          ].recovered.toLocaleString()} recovered`;
          covidEmbed.addField(name, description);
        }
        return msg.channel.send(covidEmbed);
      }
      data = await track.countries(args.text);
      if (!data || data.message) {
        const statesData = await track.states();
        data = statesData.filter((obj) => {
          return obj.state.toLowerCase() === args.text.toLowerCase();
        });
        if (!data || data.message || !data.length)
          return msg.channel.send(
            "Country or state not found or doesn't have any cases."
          );
        [data] = data;
      }
    } else {
      data = await track.all();
    }

    // eslint-disable-next-line no-nested-ternary
    const type = data.country
      ? `${data.country} (Country)`
      : data.state
      ? `${data.state} (State)`
      : 'Global';

    const cases = data.cases.toLocaleString();
    const deaths = `${data.deaths.toLocaleString()} (${(
      (100 * data.deaths) /
      data.cases
    ).toFixed(2)}%)`;
    data.recovered = data.recovered || data.cases - (data.deaths + data.active);
    const recovered = `${data.recovered.toLocaleString()} (${(
      (100 * data.recovered) /
      data.cases
    ).toFixed(2)}%)`;
    const active = `${data.active.toLocaleString()} (${(
      (100 * data.active) /
      data.cases
    ).toFixed(2)}%)`;
    const affectedCountries = data.affectedCountries
      ? data.affectedCountries
      : null;
    const covidEmbed = new MessageEmbed()
      .setTitle(`COVID-19 Statistics | ${type}`)
      .setThumbnail(
        'https://cdn.discordapp.com/attachments/651043953755422721/695297024568066058/covid.png'
      )
      .addField('Cases', cases, true)
      .addField('Deaths', deaths, true)
      .addField('Recovered', recovered, true)
      .addField('Active', active, true);
    if (affectedCountries)
      covidEmbed.addField('Affected Countries', affectedCountries, true);
    if (data.country) {
      const critical = `${data.critical.toLocaleString()} (${(
        (100 * data.critical) /
        data.cases
      ).toFixed(2)}%)`;
      const { casesPerOneMillion } = data;
      const { todayCases } = data;
      const { todayDeaths } = data;
      const { deathsPerOneMillion } = data;
      covidEmbed
        .addField('Critical', critical, true)
        .addField('Cases per million', casesPerOneMillion, true)
        .addField('Today Cases', todayCases, true)
        .addField('Today Deaths', todayDeaths, true)
        .addField('Deaths per million', deathsPerOneMillion, true);
    }
    if (data.state) {
      const { todayCases } = data;
      const { todayDeaths } = data;
      covidEmbed
        .addField('Today Cases', todayCases, true)
        .addField('Today Deaths', todayDeaths, true);
    }

    covidEmbed
      .addField(
        'Help Stop Coronavirus',
        '[Advice for Public](https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public)',
        true
      )
      .setFooter(
        `Updated On: ${moment(data.updated).format('llll z')}`,
        data.countryInfo ? data.countryInfo.flag : null
      );

    return msg.channel.send(covidEmbed);
  }
}

export default CovidCommand;
