import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom'

import { getPrismicClient } from '../../services/prismic';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import Link from 'next/link';




interface Post {
  uid: string;
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
  // navigation:{
  //   prevPost:{
  //     uid: string;
  //     data: {
  //       title: string;
  //     };
  //   }[];
  //   nextPost:{
  //     uid: string;
  //     data: {
  //       title: string;
  //     };
  //   }[];
  // }
  preview: boolean;
}

export default function Post({post, /*navigation,*/ preview = false}:PostProps) {

  const router = useRouter();

  if(router.isFallback){
    return(
    <div className={styles.containerLoading}>
      <div className={styles.imgPlaceholder}></div>
      <h1 className={styles.loading}>Carregando...</h1>
    </div>
    );
  }

  const wordPerMinute = 200;
  const amountWords = post.data.content.reduce((total, item) => {
    const heading = item.heading ? item.heading.split(' ').length : 0;
    const body = item.body ? RichText.asText(item.body).split(' ').length : 0;

    return total += (heading + body);
  },0)


  return(
    <>
      <img src={post.data.banner.url} className={styles.banner}/>
      <div className={`${styles.post} ${commonStyles.container}`}>
        <h1>{post.data.title}</h1>
        <div className={commonStyles.info}>
          <span>
            <FiCalendar/>{format(new Date(post.first_publication_date), 'dd MMM yyyy', {locale: ptBR} )}
          </span>
          <span><FiUser/>{post.data.author}</span>
          <span><FiClock/>{Math.ceil(amountWords / wordPerMinute)} min </span>
        </div>

        {/* {post.first_publication_date != post.last_publication_date &&
        <div className={styles.modifiedAt}>
          * editado em {format(new Date(post.last_publication_date), "dd MMM yyyy', às' H:m", {locale: ptBR} )}
        </div>
        } */}

        <article className={styles.content}>
          {post.data.content.map((content, index) => (
            <div key={index}>
              <h2>{content.heading}</h2>
              <div dangerouslySetInnerHTML={{
                __html:RichText.asHtml(content.body)
                }}
              />
            </div>
          ))}
        </article>

        <section className={`${styles.navigation} ${commonStyles.container}`}>

          {/* {navigation?.prevPost.length > 0 && (
            <div>
              <h3>{navigation.prevPost[0].data.title}</h3>
              <Link href={`/post/${navigation.prevPost[0].uid}`}>
                <a>Post anterior</a>
              </Link>
            </div>
          )}


          {navigation?.nextPost.length > 0 && (
            <div className={navigation?.prevPost.length == 0 && styles.onlyNext}>
              <h3>{navigation.nextPost[0].data.title}</h3>
              <Link href={`/post/${navigation.nextPost[0].uid}`}>
                <a>Próximo post</a>
              </Link>
            </div>
          )} */}
        </section>

        {preview && (
          <div className={commonStyles.previewButton}>
            <Link href="/api/exit-preview">
              <a>Sair do modo Preview</a>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const client = getPrismicClient();

  const posts = await client.getAllByType('post');

  const paths = posts.map( item => {
    return {params: {slug: item.uid}}
  });

  return {
    paths,
    fallback: 'blocking'
  };

};

export const getStaticProps: GetStaticProps = async ({params, previewData, preview = false}) => {
  const {slug} = params;
  const client = getPrismicClient({previewData});

  try {

    const response = await client.getByUID('post', String(slug), {
      ref: previewData?.ref ?? null
    });

    const notFound = response ? false : true;

    // const prevPost = await client.getAllByType('post',{
    //   pageSize: 1,
    //   after: response?.id,
    //   orderings: {
    //     field: 'document.first_publication_date',
    //     direction: 'asc',
    //   }
    // });

    // const nextPost = await client.getAllByType('post',{
    //   pageSize: 1,
    //   after: response?.id,
    //   orderings: {
    //     field: 'document.first_publication_date',
    //     direction: 'desc',
    //   }
    // })

    const post = {
      uid: response.uid,
      first_publication_date: response.first_publication_date,
      last_publication_date: response.last_publication_date,
      data: {
        title: response.data.title,
        subtitle: response.data.subtitle,
        banner: {
          url: response.data.banner.url,
        },
        author: response.data.author,
        content: response.data.content.map( item => {
          return{
            heading: item.heading,
            body: [...item.body]
          }
        })
      }
    }

    return{
      props: {
        post,
        preview,
        // navigation:{
        //   prevPost,
        //   nextPost
        // }
      },
      revalidate: 60,
      notFound
    }
  } catch (error) {
    console.log(error);
    return{

      notFound: true
    }
  }
};
