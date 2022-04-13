import { GetStaticProps } from 'next';
import { useState } from 'react';

import Head from "next/head";
import Link from "next/link";

import Prismic from '@prismicio/client';

import { getPrismicClient } from '../services/prismic';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser } from 'react-icons/fi'
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';


interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview?: boolean;
}



export default function Home({postsPagination, preview=false}: HomeProps) {

  const [posts, setPosts] = useState<Post[]>(postsPagination.results)
  const [nextPage, setNextPage] = useState(postsPagination.next_page)
  const [currentPage, setCurrentPage] = useState(1)



  async function handleLoadMore() {


    if(currentPage != 1 &&  nextPage == null) return;

    const postsData = await fetch(nextPage).then(
      response => response.json()
    );

    setNextPage(postsData.next_page);

    setCurrentPage(postsData.page);

    const newPosts = postsData.results.map( (post: Post) => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author
        }
      };
    })

    setPosts([...posts, ...newPosts]);
  }

  return(
    <>
      <Head>
        <title>Home | Space Traveling</title>
      </Head>
      <main className={`${commonStyles.container} ${styles.posts}`}>

        { posts.map( post => (
            <article key={post.uid}>
              <Link href={`/post/${post.uid}`}>
                <a>
                  <h1>{post.data.title}</h1>
                  <p>{post.data.subtitle}</p>
                  <div className={commonStyles.info}>
                    <span><FiCalendar/> {format(new Date(post.first_publication_date), 'dd MMM yyyy', {locale: ptBR} )}</span>
                    <span><FiUser/>{post.data.author} </span>
                  </div>
                </a>
              </Link>
            </article>
          ))
        }

        { nextPage &&
          <button type="button" onClick={() => handleLoadMore()}>Carregar mais posts</button>
        }

        {preview && (
          <div className='preview-button'>
          <Link href="/api/exit-preview">
            <a>Sair do modo Preview</a>
          </Link>
        </div>
        )}

      </main>
    </>
  )
}


export const getStaticProps: GetStaticProps = async ({ previewData, preview = false }) => {

  /*
  -----------------------------------------------------------------------------------------
  ALTERADO PARA VERSAO ANTIGA DO PRISMIC PARA PASSAR NO TESTE DA ROCKETSEAT QUE NAO USA
  A VERSAO ATUALIZADA. VERSAO ATUALIZADA USADA NA BRANCH DE DEV NO EXERCICIO COMPLEMENTAR
  -----------------------------------------------------------------------------------------
  */
  // const client = getPrismicClient({previewData});
  // const postsResponse = await client.getByType('post',{pageSize: 1})
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'post')],
    {
      pageSize: 1,
      orderings: '[document.last_publication_date desc]',
    }
  );

  const postsData = postsResponse.results.map( post => {

    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      }
    };
  });


  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsData,
  };

  return {
    props: {
      postsPagination,
      preview,
    },
    revalidate: 1800,
  };
};
